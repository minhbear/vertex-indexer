import { Module } from '@nestjs/common';
import { IdlDappService } from './idl-dapp.service';
import { IdlDappController } from './idl-dapp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from 'src/database/entities/entities';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [IdlDappController],
  providers: [IdlDappService],
})
export class IdlDappModule {}
