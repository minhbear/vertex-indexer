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
import { WebsocketListenerModule } from './websocket-listener/websocket-listener.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { IndexerModule } from './indexer/indexer.module';
import { IdlDappModule } from './idl-dapp/idl-dapp.module';

@Module({
  imports: [
    dbOrmModuleAsync,
    loggerModule,
    EventEmitterModule.forRoot(),
    RedisModule.forRootAsync({
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD,
      db: REDIS_DATABASE_NUMBER,
      tls: REDIS_TLS === true ? {} : undefined,
    }),
    bullModule,
    WebsocketListenerModule,
    IndexerModule,
    IdlDappModule,
  ],
  providers: [],
})
export class AppModule {}
