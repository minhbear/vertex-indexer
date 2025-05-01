import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from 'src/database/entities/entities';
import { RpcService } from './rpc.service';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature(entities), AccountModule],
  controllers: [],
  providers: [RpcService],
  exports: [RpcService],
})
export class RpcModule {}
