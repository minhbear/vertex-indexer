import { InjectQueue } from '@nestjs/bull';
import { SYSTEM_RATE_LIMITER } from './constant';

export enum SystemQueue {
  PDA_SYSTEM = 'pda-system',
  INDEXER_SYSTEM = 'indexer-system',
}

export enum SystemQueueJob {
  PDA_CHANGE = 'pda-change',
  UPDATE_INDEXER = 'update-indexer',
}

export const InjectPdaSystemQueue = () => InjectQueue(SystemQueue.PDA_SYSTEM);

export const InjectIndexerSystemQueue = () =>
  InjectQueue(SystemQueue.INDEXER_SYSTEM);

export const PdaSystemQueueConfig = {
  name: SystemQueue.PDA_SYSTEM,
  limiter: SYSTEM_RATE_LIMITER,
};

export const IndexerSystemQueueConfig = {
  name: SystemQueue.INDEXER_SYSTEM,
  limiter: SYSTEM_RATE_LIMITER,
};
