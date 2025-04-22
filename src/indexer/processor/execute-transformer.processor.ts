import { Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { PinoLogger } from 'nestjs-pino';
import { AbstractJobProcessor } from 'src/common/processors/common.processor';
import {
  InjectExecuteTransformerQueue,
  SystemQueue,
  SystemQueueJob,
} from 'src/common/queue';
import { DataSource, QueryRunner } from 'typeorm';
import * as kamino from '../utils-transform/kamino';
import * as raydium from '../utils-transform/raydium';
import * as common from '../utils-transform/common';
import { IExecuteTransformerJob } from '../interfaces/execute-transformer-job.interface';
import { ITransformResult } from '../interfaces';
import { IUserScriptContext } from '../interfaces/user-script-context.interface';

@Processor(SystemQueue.EXECUTE_TRANSFORMER)
export class ExecuteTransformerProcessor extends AbstractJobProcessor {
  constructor(
    @InjectExecuteTransformerQueue()
    private readonly executeTransformerQueue: Queue,
    private readonly dataSource: DataSource,
    protected readonly logger: PinoLogger,
  ) {
    super(logger, executeTransformerQueue);

    this.logger.setContext(ExecuteTransformerProcessor.name);
  }

  @Process(SystemQueueJob.EXECUTE_TRANSFORMER)
  async handlerExecuteTransformer(
    job: Job<IExecuteTransformerJob>,
  ): Promise<string> {
    try {
      const { context: contextData, userScript, fullTableName } = job.data;

      const context: IUserScriptContext = {
        pdaBuffer: Buffer.from(contextData.pdaBuffer),
        pdaParser: contextData.pdaParser
          ? JSON.parse(contextData.pdaParser)
          : null,
      };

      const utils = {
        kamino,
        raydium,
        common,
      };

      const executeFunction = new Function(
        'context',
        'utils',
        `${userScript}; return execute(context);`,
      );

      const result = executeFunction(context, utils);

      await this.saveDataToIndexerTable(fullTableName, result);
    } catch (error) {
      this.logger.error('Error handle execute transformer: ', error);
    }

    return 'FINISHED';
  }

  async saveDataToIndexerTable(
    dbName: string,
    input: ITransformResult,
  ): Promise<void> {
    const { action, data } = input;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (action === 'INSERT') {
        await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(dbName)
          .values(data)
          .execute();
      } else if (action === 'UPDATE') {
        if (!data.id) {
          throw new Error('Missing ID for UPDATE operation');
        }

        const { id, ...updateData } = data;

        await queryRunner.manager
          .createQueryBuilder()
          .update(dbName)
          .set(updateData)
          .where('id = :id', { id })
          .execute();
      } else if (action === 'DELETE') {
        if (!data.id) {
          throw new Error('Missing ID for DELETE operation');
        }

        // TODO: Implement DELETE
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(
        `Failed to execute ${action} on ${dbName}: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
