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
import { isArray } from 'lodash';

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
      const {
        context: contextData,
        userScript,
        fullTableName,
        indexerId,
      } = job.data;

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

      if (!this.validateResultUserScript(result)) {
        this.logger.error(
          `Invalid result from user script of indexer: ${indexerId}`,
        );
        return 'FAILED';
      }

      await this.saveDataToIndexerTable(fullTableName, result);
    } catch (error) {
      this.logger.error(`Error handle execute transformer: ${error}`);
      return 'FAILED';
    }

    return 'FINISHED';
  }

  async saveDataToIndexerTable(
    dbName: string,
    dataExecutes: ITransformResult[],
  ): Promise<void> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const result of dataExecutes) {
        const { action, data, where } = result;

        if (action === 'INSERT') {
          await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(dbName)
            .values(data)
            .execute();
        } else if (action === 'UPDATE') {
          await queryRunner.manager
            .createQueryBuilder()
            .update(dbName)
            .set(data)
            .where(where)
            .execute();
        } else if (action === 'DELETE') {
          await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from(dbName)
            .where(where)
            .execute();
        }
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Failed to execute on ${dbName}: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  private validateResultUserScript(result: any): boolean {
    if (!isArray(result)) {
      this.logger.error('Validation failed: Result is not an array', result);
      return false;
    }

    for (const item of result) {
      if (!this.validateItem(item)) {
        this.logger.error('Validation failed: Invalid item in result', item);
        return false;
      }
    }
    return true;
  }

  private validateItem(item: any): boolean {
    if (typeof item !== 'object' || item === null) {
      this.logger.error('Validation failed: Item is not an object', item);
      return false;
    }

    if (!['INSERT', 'UPDATE', 'DELETE'].includes(item?.action)) {
      this.logger.error(`Validation failed: Invalid action: ${item?.action}`);
      return false;
    }

    if ((item?.data && typeof item.data !== 'object') || item.data === null) {
      this.logger.error(
        `Validation failed: Data is not an object ${item.data}`,
      );
      return false;
    }

    if (
      (item?.where && typeof item.where !== 'object') ||
      item.where === null
    ) {
      this.logger.error(
        `Validation failed: Where is not an object ${item.where}`,
      );
      return false;
    }

    return true;
  }
}
