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
import { Repository } from 'typeorm';
import { IndexerEntity } from 'src/database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractJobProcessor } from 'src/common/processors/common.processor';
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

      for (const indexerTrigger of indexer.indexerTriggers) {
        const jobId = `${SystemQueueJob.EXECUTE_TRANSFORMER}:pda<${pdaPubkeyStr}>:indexer<${indexerId}>:trigger<${indexerTrigger.id}>:${Date.now()}`;

        await this.executeTransformerQueue.add(
          SystemQueueJob.EXECUTE_TRANSFORMER,
          {
            indexerTriggerId: indexerTrigger.id,
            indexerId,
            pdaPubkeyStr,
          } as IExecuteTransformerJob,
          {
            jobId,
          },
        );
      }
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
      .innerJoinAndSelect('indexer.indexerTriggers', 'indexerTrigger')
      .where('indexer.id = :indexerId', { indexerId })
      .andWhere('indexerTrigger.pdaPubkey = :pdaPubkeyStr', { pdaPubkeyStr })
      .getOne();
  }
}
