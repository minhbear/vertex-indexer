import { DynamicModule, Module } from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';

@Module({})
export class RedisModule {
  static async forRootAsync(options: RedisOptions): Promise<DynamicModule> {
    return {
      global: true,
      module: RedisModule,
      imports: [],
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useFactory: () => new Redis(options),
        },
      ],
      exports: ['REDIS_CLIENT'],
    };
  }
}
