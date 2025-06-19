import { Process, Processor } from '@nestjs/bull';
import { PinoLogger } from 'nestjs-pino';
import {
  InjectIndexerSystemQueue,
  InjectPdaSystemQueue,
  SystemQueue,
  SystemQueueJob,
} from 'src/common/queue';
import { IPdaChangeJob, IUpdateIndexerJob } from '../interfaces';
import { Job, Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { IndexerEntity, IndexerTriggerEntity } from 'src/database/entities';
import { Repository } from 'typeorm';
import { GET_INDEXER_PAGING } from 'src/app.environment';
import { isEmpty } from 'lodash';
import { AbstractJobProcessor } from 'src/common/processors/common.processor';

@Processor(SystemQueue.PDA_SYSTEM)
export class PdaProcessor extends AbstractJobProcessor {
  constructor(
    @InjectPdaSystemQueue()
    private readonly pdaSystemQueue: Queue,
    @InjectIndexerSystemQueue()
    private readonly indexerSystemQueue: Queue,
    @InjectRepository(IndexerEntity)
    private readonly indexerRepository: Repository<IndexerEntity>,
    protected readonly logger: PinoLogger,
  ) {
    super(logger, pdaSystemQueue);
    this.logger.setContext(PdaProcessor.name);
  }

  @Process(SystemQueueJob.PDA_CHANGE)
  async handleGetIndexersForSyncData(job: Job<IPdaChangeJob>): Promise<string> {
    try {
      const { pdaPubkeyStr, programId } = job.data;
      let page = 0;
      let indexers = await this.getIndexerWithProgramIdAndPdaPubkey({
        page,
        programId,
        pdaPubkeyStr,
      });

      while (!isEmpty(indexers)) {
        for (const indexer of indexers) {
          const jobId = `${SystemQueueJob.UPDATE_INDEXER}:indexer<${indexer.id}>:program<${programId}>:pda<${pdaPubkeyStr}>`;
          await this.indexerSystemQueue.add(
            SystemQueueJob.UPDATE_INDEXER,
            {
              indexerId: indexer.id,
              programId,
              pdaPubkeyStr,
            } as IUpdateIndexerJob,
            {
              jobId,
            },
          );
          this.logger.info(`Add job ${jobId} to queue`);

          page++;
          indexers = await this.getIndexerWithProgramIdAndPdaPubkey({
            page,
            programId,
            pdaPubkeyStr,
          });
        }
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }

    return 'FINISHED';
  }

  private async getIndexerWithProgramIdAndPdaPubkey(input: {
    programId: string;
    pdaPubkeyStr: string;
    page: number;
  }): Promise<IndexerEntity[]> {
    return await this.indexerRepository
      .createQueryBuilder('indexer')
      .innerJoinAndMapMany(
        'indexer.indexerTriggers',
        IndexerTriggerEntity,
        'indexerTrigger',
        'indexerTrigger.indexerId = indexer.id',
      )
      .where('indexerTrigger.pdaPubkey = :pdaPubkeyStr', {
        pdaPubkeyStr: input.pdaPubkeyStr,
      })
      .andWhere('indexer.programId = :programId', {
        programId: input.programId,
      })
      .andWhere('indexer.isActive = :isActive', { isActive: true })
      .take(GET_INDEXER_PAGING)
      .skip(input.page * GET_INDEXER_PAGING)
      .getMany();
  }
}
