import { InjectQueue } from '@nestjs/bull';
import { SYSTEM_RATE_LIMITER } from './constant';

export enum SystemQueue {
  PDA_SYSTEM = 'pda-system',
  INDEXER_SYSTEM = 'indexer-system',
  EXECUTE_TRANSFORMER = 'execute-transformer',
}

export enum SystemQueueJob {
  PDA_CHANGE = 'pda-change',
  UPDATE_INDEXER = 'update-indexer',
  EXECUTE_TRANSFORMER = 'execute-transformer',
}

export const InjectPdaSystemQueue = () => InjectQueue(SystemQueue.PDA_SYSTEM);

export const InjectIndexerSystemQueue = () =>
  InjectQueue(SystemQueue.INDEXER_SYSTEM);

export const InjectExecuteTransformerQueue = () =>
  InjectQueue(SystemQueue.EXECUTE_TRANSFORMER);

export const PdaSystemQueueConfig = {
  name: SystemQueue.PDA_SYSTEM,
  limiter: SYSTEM_RATE_LIMITER,
};

export const IndexerSystemQueueConfig = {
  name: SystemQueue.INDEXER_SYSTEM,
  limiter: SYSTEM_RATE_LIMITER,
};

export const ExecuteTransformerQueueConfig = {
  name: SystemQueue.EXECUTE_TRANSFORMER,
  limiter: SYSTEM_RATE_LIMITER,
};
