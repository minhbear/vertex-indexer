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
      // TODO: Write action save to database
    } catch (error) {
      this.logger.error(error);
      throw error;
    }

    return 'FINISHED';
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
