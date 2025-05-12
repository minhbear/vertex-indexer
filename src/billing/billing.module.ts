import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from 'src/database/entities/entities';
import { BillingService } from './billing.service';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
