import {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_DATABASE_NUMBER,
  REDIS_PASSWORD,
  REDIS_TLS,
  JOB_MAX_NUMBER_PROCESS,
  JOB_MAX_PROCESS_DURATION,
  BULL_DEFAULT_ATTEMPTS_COUNT,
  BULL_DEFAULT_BACKOFF_MILLISECONDS,
} from '../app.environment';
import { BullModule, BullModuleOptions } from '@nestjs/bull';

const bullModuleOptions: BullModuleOptions = {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    db: REDIS_DATABASE_NUMBER,
    tls: REDIS_TLS === true ? {} : undefined,
  },
  limiter: {
    max: JOB_MAX_NUMBER_PROCESS,
    duration: JOB_MAX_PROCESS_DURATION,
    /** When jobs get rate limited, they stay in the waiting queue and are not moved to the delayed queue */
    bounceBack: true,
  },
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
    attempts: BULL_DEFAULT_ATTEMPTS_COUNT,
    backoff: BULL_DEFAULT_BACKOFF_MILLISECONDS,
  },
};

export const bullModule = BullModule.forRootAsync({
  useFactory: () => bullModuleOptions,
});
