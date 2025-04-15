import {
  Injectable,
  InternalServerErrorException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PinoLogger } from 'nestjs-pino';
import WebSocket from 'ws';
import { ILogsNotificationRPCResponse } from './interfaces/socket-log-notification.interface';
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
import { isNil } from 'lodash';

@Injectable()
export class WebsocketListenerService implements OnModuleInit, OnModuleDestroy {
  private readonly programClusterIds: Map<Cluster, string[]> = new Map();
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
      const wsRpcUrl = this.rpcService.getFullWsUrl(rpc);

      const rpcSocket = new WebSocket(wsRpcUrl);
      this.rpcWebsockets.get(rpc.cluster).push(rpcSocket);
      this.logger.info(`Connect to RPC (${rpc.cluster}): ${wsRpcUrl}`);
    });

    const programs = await this.getAllProgram();
    for (const program of programs) {
      if (!this.programClusterIds.has(program.network)) {
        this.programClusterIds.set(program.network, []);
      }
      this.programClusterIds.get(program.network).push(program.programId);
    }

    for (const [cluster, rpcSockets] of this.rpcWebsockets.entries()) {
      rpcSockets.forEach((rpcSocket) => {
        rpcSocket.onopen = (greeting) => {
          logger.info({ greeting });
          this.programSubscribe(cluster, this.programClusterIds.get(cluster));
        };
      });
    }

    // Subscribe for PDA change
    for (const rpcSockets of this.rpcWebsockets.values()) {
      for (const rpcSocket of rpcSockets) {
        rpcSocket.onmessage = async (event) => {
          const eventData = JSON.parse(
            event.data as any,
          ) as ILogsNotificationRPCResponse;
          if (eventData.method === 'programNotification') {
            const programId = eventData.params?.result?.value?.account?.owner;
            const pdaPubkeyStr = eventData.params?.result?.value?.pubkey;
            const jobId = `${SystemQueueJob.PDA_CHANGE}-${programId}-${pdaPubkeyStr}`;
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

  @OnEvent(IndexerEventName.INDEXER_CREATED)
  handleSubscribeProgramListener(event: IndexerCreateEvent) {
    const { cluster, programId } = event;
    const programIds = this.programClusterIds.get(cluster);

    if (!programIds.includes(event.programId)) {
      programIds.push(event.programId);
      this.programSubscribe(cluster, [programId]);
    }
  }

  onModuleDestroy() {
    this.logger.info(`Stop sync PDA  at ${new Date()}`);

    this.rpcWebsockets.forEach((rpcSockets) => {
      rpcSockets.forEach((rpcSocket) => {
        rpcSocket.onclose = (event) => {
          this.logger.info(`Close connection rpc websocket: ${event.reason}`);
        };
      });
    });

    clearInterval(this.interval!);
  }

  protected async programSubscribe(cluster: Cluster, programIds?: string[]) {
    if (isNil(programIds)) {
      this.logger.info(`No programs for cluster: ${cluster}`);
      return;
    }
    const rpcSockets = this.rpcWebsockets.get(cluster);
    if (!rpcSockets) {
      this.logger.error(`No RPC socket found for cluster: ${cluster}`);
      return;
    }
    for (const programId of programIds) {
      // TODO: Create strategy to subscribe program for each rpc
      rpcSockets[0].send(
        JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'programSubscribe',
          params: [
            programId,
            {
              encoding: 'base64',
              commitment: 'finalized',
            },
          ],
        }),
      );

      this.logger.info(`Subscribe program ${programId} for cluster ${cluster}`);
    }
  }

  async getAllProgram(): Promise<{ programId: string; network: Cluster }[]> {
    const indexers = await this.indexerRepository
      .createQueryBuilder('indexer')
      .select(['DISTINCT program_id', 'cluster'])
      .getRawMany();

    return indexers.map((indexer) => {
      return {
        programId: indexer.program_id,
        network: indexer.cluster,
      };
    });
  }
}
