import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from 'src/database/entities/entities';
import { AccountService } from './account.service';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
