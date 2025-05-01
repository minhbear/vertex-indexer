import {
  REDIS_DATABASE_NUMBER,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
} from '../app.environment';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';

const redisConnection = `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/${REDIS_DATABASE_NUMBER}`;

export const cacheModule = CacheModule.registerAsync({
  isGlobal: true,
  useFactory: async () => {
    const keyvRedis = new Keyv({
      store: new KeyvRedis(redisConnection),
      ttl: 10000, // Set a TTL (optional)
    });

    keyvRedis.on('error', (err) => console.error('Redis Cache Error:', err));

    return {
      store: keyvRedis,
    };
  },
});
