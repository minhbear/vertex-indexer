import { RateLimiter } from 'bull';

const QUEUE_LIMIT_SYSTEM_WORKER = 2;
const QUEUE_LIMIT_SYSTEM_DURATION = 1000;

export const SYSTEM_RATE_LIMITER: RateLimiter = {
  max: QUEUE_LIMIT_SYSTEM_WORKER,
  duration: QUEUE_LIMIT_SYSTEM_DURATION,
};
