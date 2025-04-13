import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from 'src/database/entities/entities';
import { RpcController } from './rpc.controller';
import { RpcService } from './rpc.service';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [RpcController],
  providers: [RpcService],
  exports: [RpcService],
})
export class RpcModule {}
