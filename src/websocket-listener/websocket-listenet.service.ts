import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PinoLogger } from 'nestjs-pino';
import { WS_RPC_URL } from 'src/app.environment';
import WebSocket from 'ws';
import { ILogsNotificationRPCResponse } from './interfaces/socket-log-notification.interface';
import { IndexerEventName } from 'src/common/enum/event.enum';
import { IndexerCreateEvent } from './interfaces/event-module.interface';
import { Queue } from 'bull';
import { InjectPdaSystemQueue, SystemQueueJob } from 'src/common/queue';
import { IPdaChangeJob } from 'src/indexer/interfaces';
import { Repository } from 'typeorm';
import { IdlDappEntity } from 'src/database/entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WebsocketListenerService implements OnModuleInit, OnModuleDestroy {
  private programIds: string[];
  private readonly rpcSocket: WebSocket;
  private interval: NodeJS.Timeout | null;
  private readonly KEEP_ALIVE_INTERVAL = 5000;

  constructor(
    @InjectPdaSystemQueue()
    private readonly pdaSystemQueue: Queue,
    @InjectRepository(IdlDappEntity)
    private readonly idlDappRepository: Repository<IdlDappEntity>,
    private readonly logger: PinoLogger,
  ) {
    this.rpcSocket = new WebSocket(WS_RPC_URL);
    this.programIds = [];

    this.logger.setContext(WebsocketListenerService.name);
  }

  async onModuleInit() {
    this.logger.info(`Start Sync PDA at ${new Date()}`);
    const logger = this.logger;
    this.programIds = await this.getAllProgramId();
    this.rpcSocket.onopen = (greeting) => {
      logger.info({ greeting });
      this.programSubscribe(this.programIds);
    };
    this.rpcSocket.onmessage = async (event) => {
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
    const keepAliveHandler = () => {
      this.rpcSocket.send('ping');
    };
    this.interval = setInterval(keepAliveHandler, this.KEEP_ALIVE_INTERVAL);
  }

  @OnEvent(IndexerEventName.INDEXER_CREATED)
  handleSubscribeProgramListener(event: IndexerCreateEvent) {
    if (!this.programIds.includes(event.programId)) {
      this.programIds.push(event.programId);
      this.programSubscribe([event.programId]);
      this.logger.info('Subscribe program: ', event.programId);
    }
  }

  onModuleDestroy() {
    this.logger.info(`Stop sync PDA  at ${new Date()}`);

    this.rpcSocket.onclose = (event) => {
      this.logger.info(`Close connection rpc websocket: ${event.reason}`);
    };

    clearInterval(this.interval!);
  }

  protected async programSubscribe(programIds: string[]) {
    for (const programId of programIds) {
      this.rpcSocket.send(
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
    }
  }

  async getAllProgramId(): Promise<string[]> {
    const idlDapps = await this.idlDappRepository
      .createQueryBuilder('idlDapp')
      .select('DISTINCT(idlDapp.programId) AS program_id')
      .getRawMany();

    return idlDapps.map((idlDapp) => idlDapp.program_id);
  }
}
