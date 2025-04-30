import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { RpcEntity } from 'src/database/entities/rpc.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RpcService implements OnModuleInit {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
    @InjectRepository(RpcEntity)
    private readonly rpcRepository: Repository<RpcEntity>,
  ) {}

  async onModuleInit() {
    const rpcs = await this.findAll();
    for (const rpc of rpcs) {
      await this.redis.set(`rpc:${rpc.cluster}`, rpc.url);
    }
  }

  async findAll(): Promise<RpcEntity[]> {
    return this.rpcRepository.find({
      where: { isActive: true },
    });
  }
}
