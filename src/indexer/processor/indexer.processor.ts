import { Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { PinoLogger } from 'nestjs-pino';
import {
  InjectExecuteTransformerQueue,
  InjectIndexerSystemQueue,
  SystemQueue,
  SystemQueueJob,
} from 'src/common/queue';
import { IUpdateIndexerJob } from '../interfaces';
import { Connection, PublicKey } from '@solana/web3.js';
import { Repository } from 'typeorm';
import { IndexerEntity } from 'src/database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { AbstractJobProcessor } from 'src/common/processors/common.processor';
import { serializePda } from 'src/common/utils';
import { isNil } from 'lodash';
import { IExecuteTransformerJob } from '../interfaces/execute-transformer-job.interface';

@Processor(SystemQueue.INDEXER_SYSTEM)
export class IndexerProcessor extends AbstractJobProcessor {
  constructor(
    @InjectIndexerSystemQueue()
    private readonly indexerSystemQueue: Queue,
    @InjectExecuteTransformerQueue()
    private readonly executeTransformerQueue: Queue,
    @InjectRepository(IndexerEntity)
    private readonly indexerRepository: Repository<IndexerEntity>,
    protected readonly logger: PinoLogger,
  ) {
    super(logger, indexerSystemQueue);

    this.logger.setContext(IndexerProcessor.name);
  }

  @Process(SystemQueueJob.UPDATE_INDEXER)
  async handlerUpdateDataToIndexerTable(
    job: Job<IUpdateIndexerJob>,
  ): Promise<string> {
    try {
      const { indexerId, pdaPubkeyStr } = job.data;

      const indexer = await this.getIndexer(indexerId, pdaPubkeyStr);
      const connection = new Connection(indexer.rpcUrl, {
        commitment: 'confirmed',
      });

      const idlJson = indexer.idl?.idlJson;
      let pdaParser: any = null;
      const pdaPubkey = new PublicKey(pdaPubkeyStr);
      const pdaBuffer = (await connection.getAccountInfo(pdaPubkey)).data;
      if (!isNil(idlJson)) {
        const pdaName = indexer.indexerTriggers[0].pdaName;
        const provider = new AnchorProvider(connection, null, {});
        const program = new Program(idlJson, indexer.programId, provider);
        if (!(pdaName in program.account)) {
          this.logger.error(`PDA name ${pdaName} not found in program account`);
          return 'FAILED';
        }

        pdaParser = await program.account[pdaName].fetch(pdaPubkey);
      }
      const transformScript = indexer.indexerTriggers[0].transformerPda.script;

      let pdaSerialized: any = null;
      if (!isNil(pdaParser)) {
        pdaSerialized = serializePda(pdaParser);
      }

      const context = {
        pdaBuffer,
        pdaParser: pdaSerialized ?? null,
      };

      const jobId = `${SystemQueueJob.EXECUTE_TRANSFORMER}-${indexerId}-${pdaPubkeyStr}-${Date.now()}`;

      await this.executeTransformerQueue.add(
        SystemQueueJob.EXECUTE_TRANSFORMER,
        {
          context,
          fullTableName: indexer.indexerTriggers[0].indexerTable.fullTableName,
          userScript: transformScript,
        } as IExecuteTransformerJob,
        {
          jobId,
        },
      );
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
      .leftJoinAndSelect('indexer.idl', 'idl')
      .innerJoinAndSelect('indexer.indexerTriggers', 'indexerTrigger')
      .innerJoinAndSelect('indexerTrigger.transformerPda', 'transformerPda')
      .innerJoinAndSelect('indexerTrigger.indexerTable', 'indexerTable')
      .where('indexer.id = :indexerId', { indexerId })
      .andWhere('indexerTrigger.pdaPubkey = :pdaPubkeyStr', { pdaPubkeyStr })
      .getOne();
  }
}
