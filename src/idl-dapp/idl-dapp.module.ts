import { Module } from '@nestjs/common';
import { IdlDappService } from './idl-dapp.service';
import { IdlDappController } from './idl-dapp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from 'src/database/entities/entities';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature(entities), AccountModule],
  controllers: [IdlDappController],
  providers: [IdlDappService],
})
export class IdlDappModule {}
