import { Module } from '@nestjs/common';
import { IdlDappService } from './idl-dapp.service';
import { IdlDappController } from './idl-dapp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from 'src/database/entities/entities';
import { AccountModule } from 'src/account/account.module';
import { BullModule } from '@nestjs/bull';
import { IndexerSystemQueueConfig } from 'src/common/queue';

@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
    AccountModule,
    BullModule.registerQueue(IndexerSystemQueueConfig),
  ],
  controllers: [IdlDappController],
  providers: [IdlDappService],
})
export class IdlDappModule {}
