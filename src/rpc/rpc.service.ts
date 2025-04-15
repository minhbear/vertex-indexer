import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcEntity } from 'src/database/entities/rpc.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RpcService {
  constructor(
    @InjectRepository(RpcEntity)
    private readonly rpcRepository: Repository<RpcEntity>,
  ) {}

  async findAll(): Promise<RpcEntity[]> {
    return this.rpcRepository.find({
      where: { isActive: true },
    });
  }

  async findById(id: number): Promise<RpcEntity> {
    const rpc = await this.rpcRepository.findOne({ where: { id } });
    if (!rpc) {
      throw new NotFoundException(`RPC  not found`);
    }
    return rpc;
  }

  getFullWsUrl(rpc: RpcEntity): string {
    return `wss://${rpc.url}` + (rpc.apiKey ? `?apiKey=${rpc.apiKey}` : '');
  }

  getFullHttpUrl(rpc: RpcEntity): string {
    return `https://${rpc.url}` + (rpc.apiKey ? `?apiKey=${rpc.apiKey}` : '');
  }
}
