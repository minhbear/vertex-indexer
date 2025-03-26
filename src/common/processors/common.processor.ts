import {
  OnGlobalQueueActive,
  OnGlobalQueueCompleted,
  OnGlobalQueueFailed,
} from '@nestjs/bull';
import { Job, JobId, Queue } from 'bull';
import { isNil } from 'lodash';
import { PinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

export abstract class AbstractJobProcessor {
  protected readonly logger: PinoLogger;
  protected readonly queue: Queue;
  protected enableLogging: boolean;

  protected constructor(
    logger: PinoLogger,
    queue: Queue,
    enableLogging: boolean = true,
  ) {
    logger.setContext(this.constructor.name);
    this.logger = logger;
    this.queue = queue;
    this.enableLogging = enableLogging;
  }

  @OnGlobalQueueActive()
  async onGlobalActive(jobId: JobId): Promise<void> {
    if (this.enableLogging) {
      const job = await this.getJob(jobId);
      this.logger_(job).debug(`(Global) Processing job ${jobId}`);
    }
  }

  @OnGlobalQueueCompleted()
  async onGlobalCompleted(jobId: JobId, result: any): Promise<void> {
    if (this.enableLogging) {
      const job = await this.getJob(jobId);
      this.logger_(job).debug(
        `(Global) on completed: ${jobId} with result: ${result}`,
      );
    }
  }

  @OnGlobalQueueFailed()
  async onFailed(jobId: JobId, error: Error) {
    const job = await this.getJob(jobId);
    await this.handleError(job, error);
  }

  logger_(job: Job): Logger {
    if (isNil(job)) {
      return this.logger.logger;
    }

    return this.logger.logger.child({
      jobName: job.name,
      jobId: job.id,
    });
  }

  async getJob(jobId: JobId): Promise<Job> {
    return await this.queue.getJob(jobId);
  }

  handleError(job: Job, error: Error): Promise<void> | void {
    this.logger_(job).error(error, `(Global) Job Error: ${job?.id}`);
  }
}
