import { Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { PinoLogger } from 'nestjs-pino';
import {
  InjectIndexerSystemQueue,
  SystemQueue,
  SystemQueueJob,
} from 'src/common/queue';
import { IUpdateIndexerJob } from '../interfaces';
import { Connection, PublicKey } from '@solana/web3.js';
import { RPC_URL } from 'src/app.environment';
import { Repository } from 'typeorm';
import { IndexerEntity } from 'src/database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { AbstractJobProcessor } from 'src/common/processors/common.processor';
import path from 'path';
import { Worker } from 'worker_threads';
import { serializePda } from 'src/common/utils';

@Processor(SystemQueue.INDEXER_SYSTEM)
export class IndexerProcessor extends AbstractJobProcessor {
  private readonly connection: Connection;

  constructor(
    @InjectIndexerSystemQueue()
    private readonly indexerSystemQueue: Queue,
    @InjectRepository(IndexerEntity)
    private readonly indexerRepository: Repository<IndexerEntity>,
    protected readonly logger: PinoLogger,
  ) {
    super(logger, indexerSystemQueue);

    this.connection = new Connection(RPC_URL, { commitment: 'confirmed' });
    this.logger.setContext(IndexerProcessor.name);
  }

  @Process(SystemQueueJob.UPDATE_INDEXER)
  async handlerUpdateDataToIndexerTable(
    job: Job<IUpdateIndexerJob>,
  ): Promise<string> {
    try {
      const { indexerId, pdaPubkeyStr } = job.data;

      const indexer = await this.getIndexer(indexerId, pdaPubkeyStr);
      const idlJson = indexer.idl.idlJson;
      const provider = new AnchorProvider(this.connection, null, {});
      const program = new Program(idlJson, indexer.programId, provider);
      const pdaPubkey = new PublicKey(pdaPubkeyStr);
      const pdaName = indexer.indexerTriggers[0].pdaName;
      if (!(pdaName in program.account)) {
        this.logger.error(`PDA name ${pdaName} not found in program account`);
        return 'FAILED';
      }

      const accountData = await program.account[pdaName].fetch(pdaPubkey);
      // TODO: Split to Job if monitor had issue performance/bottleneck

      await this.executeUserScript(accountData);

      // TODO: Save to DB
    } catch (error) {
      this.logger.error(error);
      throw error;
    }

    return 'FINISHED';
  }

  async executeUserScript(pdaParser: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // NOTE: Sample User script
      const userScript = `
        function execute(pdaParser) {
          const marketPrice = new utils.kamino.Fraction(pdaParser.liquidity.marketPriceSf);

          return marketPrice.toDecimal().toString();
        }
      `;
      const serialize = serializePda(pdaParser);

      const worker = new Worker(path.resolve(__dirname, './worker.js'), {
        workerData: {
          userScript,
          pdaParser: JSON.stringify(serialize),
        },
      });

      worker.on('message', (result) => {
        this.logger.debug('🚀 Worker Result:', result);
        resolve(result);
        worker.terminate();
      });

      worker.on('error', (error) => {
        this.logger.error('Worker Error:', error);
        reject(error);
        worker.terminate();
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker exited with code ${code}`));
        }
      });
    });
  }

  private async getIndexer(
    indexerId: number,
    pdaPubkeyStr: string,
  ): Promise<IndexerEntity> {
    return await this.indexerRepository
      .createQueryBuilder('indexer')
      .innerJoinAndSelect('indexer.idl', 'idl')
      .innerJoinAndSelect('indexer.indexerTriggers', 'indexerTrigger')
      .innerJoinAndSelect('indexerTrigger.transformerPda', 'transformerPda')
      .innerJoinAndSelect('indexerTrigger.indexerTable', 'indexerTable')
      .where('indexer.id = :indexerId', { indexerId })
      .andWhere('indexerTrigger.pdaPubkey = :pdaPubkeyStr', { pdaPubkeyStr })
      .getOne();
  }
}
