import { Module } from '@nestjs/common';
import { bullModule, dbOrmModuleAsync, loggerModule } from './config';
import { RedisModule } from './redis/redis.module';
import {
  REDIS_DATABASE_NUMBER,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_TLS,
} from './app.environment';

@Module({
  imports: [
    dbOrmModuleAsync,
    loggerModule,
    RedisModule.forRootAsync({
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD,
      db: REDIS_DATABASE_NUMBER,
      tls: REDIS_TLS === true ? {} : undefined,
    }),
    bullModule,
  ],
  providers: [],
})
export class AppModule {}
