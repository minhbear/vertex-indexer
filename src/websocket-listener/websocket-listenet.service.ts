import {
  Injectable,
  InternalServerErrorException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PinoLogger } from 'nestjs-pino';
import WebSocket from 'ws';
import {
  ILogsNotificationAccountChangeRPCResponse,
  ILogSuccessSubscribeRPCResponse,
} from './interfaces/socket-log-notification.interface';
import { IndexerEventName } from 'src/common/enum/event.enum';
import { IndexerCreateEvent } from './interfaces/event-module.interface';
import { Queue } from 'bull';
import { InjectPdaSystemQueue, SystemQueueJob } from 'src/common/queue';
import { IPdaChangeJob } from 'src/indexer/interfaces';
import { Repository } from 'typeorm';
import { IndexerEntity } from 'src/database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcService } from 'src/rpc/rpc.service';
import { Cluster, RpcEntity } from 'src/database/entities/rpc.entity';
import { isEmpty, isNil } from 'lodash';

@Injectable()
export class WebsocketListenerService implements OnModuleInit, OnModuleDestroy {
  private readonly programsClusterMap: Map<Cluster, string[]> = new Map();
  private readonly programPdasMap: Map<string, Set<string>> = new Map();

  private readonly subscribeCounterPdaMap: Map<number, string> = new Map();
  private readonly subscribeIdPdaMap: Map<number, string> = new Map();

  private subscribeCounter = 1;

  private interval: NodeJS.Timeout | null;
  private readonly KEEP_ALIVE_INTERVAL = 5000;
  private readonly rpcs: RpcEntity[] = [];
  private readonly rpcWebsockets: Map<Cluster, WebSocket[]> = new Map();

  constructor(
    private readonly rpcService: RpcService,
    @InjectPdaSystemQueue()
    private readonly pdaSystemQueue: Queue,
    @InjectRepository(IndexerEntity)
    private readonly indexerRepository: Repository<IndexerEntity>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(WebsocketListenerService.name);
  }

  async onModuleInit() {
    this.logger.info(`Start Init websocket listener at ${new Date()}`);
    const logger = this.logger;

    this.rpcs.push(...(await this.rpcService.findAll()));
    if (this.rpcs.length === 0) {
      logger.error('No RPCs found');
      throw new InternalServerErrorException('No RPCs found');
    }

    this.rpcs.forEach((rpc) => {
      if (!this.rpcWebsockets.has(rpc.cluster)) {
        this.rpcWebsockets.set(rpc.cluster, []);
      }

      const wsRpc = `ws://${rpc.url}`;

      const rpcSocket = new WebSocket(wsRpc);
      this.rpcWebsockets.get(rpc.cluster).push(rpcSocket);
      this.logger.info(`Connect to RPC (${rpc.cluster}): ${wsRpc}`);
    });

    this.programsClusterMap.set(Cluster.MAINNET, []);
    this.programsClusterMap.set(Cluster.DEVNET, []);
    this.programsClusterMap.set(Cluster.TESTNET, []);

    const programs = await this.getAllProgramWithPda();
    if (programs.length > 0) {
      for (const program of programs) {
        this.programsClusterMap.get(program.cluster).push(program.programId);

        if (!this.programPdasMap.has(program.programId)) {
          this.programPdasMap.set(program.programId, new Set());
        }
        program.pdas.forEach((pda) => {
          this.programPdasMap.get(program.programId).add(pda);
        });
      }
    }

    for (const [cluster, rpcSockets] of this.rpcWebsockets.entries()) {
      rpcSockets.forEach((rpcSocket) => {
        rpcSocket.onopen = (greeting) => {
          logger.info({ greeting });
          this.programSubscribeAccount(
            cluster,
            this.programsClusterMap.get(cluster),
          );
        };
      });
    }

    // Subscribe for PDA change
    for (const rpcSockets of this.rpcWebsockets.values()) {
      // TODO: Need to update if had more than 1 rpc in one cluster
      for (const rpcSocket of rpcSockets) {
        rpcSocket.onmessage = async (event) => {
          const eventData = JSON.parse(event.data as any) as
            | ILogsNotificationAccountChangeRPCResponse
            | ILogSuccessSubscribeRPCResponse;

          // Map subcription id to pda
          if ('result' in eventData) {
            const subscribeCounter = eventData.id;
            const subscribeId = eventData.result;

            const pda = this.subscribeCounterPdaMap.get(subscribeCounter);
            if (pda) {
              this.subscribeIdPdaMap.set(subscribeId, pda);
              this.logger.info(`Subscribe pda ${pda} with id ${subscribeId}`);
            }
          } else if (eventData.method === 'accountNotification') {
            const programId = eventData.params?.result?.value?.owner;
            const pdaPubkeyStr = this.subscribeIdPdaMap.get(
              eventData.params.subscription,
            );

            if (pdaPubkeyStr) {
              const jobId = `${SystemQueueJob.PDA_CHANGE}:program<${programId}>:pda<${pdaPubkeyStr}>`;
              await this.pdaSystemQueue.add(
                SystemQueueJob.PDA_CHANGE,
                {
                  pdaPubkeyStr,
                  programId,
                } as IPdaChangeJob,
                {
                  jobId,
                },
              );
              this.logger.info('Finish add job to queue: ', jobId);
            }
          }
        };
      }
    }
    const keepAliveHandler = () => {
      this.rpcWebsockets.forEach((rpcSockets) => {
        rpcSockets.forEach((rpcSocket) => {
          if (rpcSocket.readyState === WebSocket.OPEN) {
            rpcSocket.send('ping');
          }
        });
      });
    };
    this.interval = setInterval(keepAliveHandler, this.KEEP_ALIVE_INTERVAL);
  }

  @OnEvent(IndexerEventName.INDEXER_TRIGGER_CREATED)
  async handleSubscribeProgramListener(event: IndexerCreateEvent) {
    const { cluster, programId, pda } = event;
    const programIds = this.programsClusterMap.get(cluster);

    if (!programIds.includes(programId)) {
      programIds.push(programId);
    }

    if (!this.programPdasMap.has(programId)) {
      this.programPdasMap.set(programId, new Set());
    }

    const pdas = this.programPdasMap.get(programId);
    if (!pdas.has(pda)) {
      pdas.add(pda);
      await this.accountSubscribe(cluster, pda);
    }
  }

  onModuleDestroy() {
    this.logger.info(`Stop websocket listener at ${new Date()}`);

    this.rpcWebsockets.forEach((rpcSockets) => {
      rpcSockets.forEach((rpcSocket) => {
        rpcSocket.onclose = (event) => {
          this.logger.info(`Close connection rpc websocket: ${event.reason}`);
        };
      });
    });

    clearInterval(this.interval!);
  }

  private async programSubscribeAccount(
    cluster: Cluster,
    programIds?: string[],
  ) {
    if (isNil(programIds)) {
      this.logger.info(`No programs for cluster: ${cluster}`);
      return;
    }

    for (const programId of programIds) {
      const pdas = Array.from(this.programPdasMap.get(programId));
      if (!isEmpty(pdas)) {
        for (const pda of pdas) {
          await this.accountSubscribe(cluster, pda);
        }
      }
    }
  }

  private async accountSubscribe(cluster: Cluster, pda: string) {
    const rpcSockets = this.rpcWebsockets.get(cluster);
    if (!rpcSockets) {
      this.logger.error(`No RPC socket found for cluster: ${cluster}`);
      return;
    }

    // TODO: Create strategy to subscribe account for each rpc
    rpcSockets[0].send(
      JSON.stringify({
        jsonrpc: '2.0',
        id: this.subscribeCounter,
        method: 'accountSubscribe',
        params: [
          pda,
          {
            encoding: 'base64',
            commitment: 'finalized',
          },
        ],
      }),
    );

    this.subscribeCounterPdaMap.set(this.subscribeCounter, pda);
    this.subscribeCounter += 1;
  }

  private async getAllProgramWithPda(): Promise<
    { programId: string; pdas: Set<string>; cluster: Cluster }[]
  > {
    const indexers = await this.indexerRepository.find({
      relations: {
        indexerTriggers: true,
      },
    });

    return indexers.map((indexer) => {
      const pdas = new Set<string>();
      indexer.indexerTriggers.forEach((trigger) => {
        pdas.add(trigger.pdaPubkey);
      });
      return {
        programId: indexer.programId,
        pdas,
        cluster: indexer.cluster,
      };
    });
  }
}
