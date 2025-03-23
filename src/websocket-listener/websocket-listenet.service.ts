import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { WS_RPC_URL } from 'src/app.environment';
import { IndexerEntity } from 'src/database/entities';
import { Repository } from 'typeorm';
import WebSocket from 'ws';
import { ILogsNotificationRPCResponse } from './interfaces/socket-log-notification.interface';
import { Connection } from '@solana/web3.js';
import { IndexerEventName } from 'src/common/enum/event.enum';
import { IndexerCreateEvent } from './interfaces/event-module.interface';

@Injectable()
export class WebsocketListenerService implements OnModuleInit, OnModuleDestroy {
  private programIds: string[];
  private readonly rpcSocket: WebSocket;
  private readonly connection: Connection;
  private interval: NodeJS.Timeout | null;
  private readonly KEEP_ALIVE_INTERVAL = 5000;

  constructor(
    @InjectRepository(IndexerEntity)
    private readonly indexerRepository: Repository<IndexerEntity>,
    private readonly logger: PinoLogger,
  ) {
    this.rpcSocket = new WebSocket(WS_RPC_URL);
    this.programIds = [];
  }

  async onModuleInit() {
    this.logger.info(`Start Sync PDA at ${new Date()}`);
    const logger = this.logger;

    this.programIds = await this.getAllProgramId();

    this.rpcSocket.onopen = (greeting) => {
      logger.info({ greeting });
      this.programSubscribe(this.programIds);
    };

    this.rpcSocket.onmessage = (event) => {
      const eventData = JSON.parse(
        event.data as any,
      ) as ILogsNotificationRPCResponse;

      if (eventData.method === 'programNotification') {
        console.log('>>>>>>>', eventData.params?.result);
        console.log(
          'Pubkey PDA change: ',
          eventData.params?.result?.value?.pubkey,
        );
        console.log('Owner: ', eventData.params?.result?.value?.account?.owner);
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
    // NOTE: Will uncomment when implement Indexer Management API
    // const indexers = await this.indexerRepository
    //   .createQueryBuilder('i')
    //   .select('DISTINCT i.programId')
    //   .getRawMany();
    // return indexers.map((i) => i.programId);

    return [
      'KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD', // Kamino Lending
      'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK', // Raydium CLMM
    ];
  }
}
