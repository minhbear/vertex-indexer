import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { IndexerEntity } from 'src/database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class IndexerService {
  constructor(
    @InjectRepository(IndexerEntity)
    private readonly indexerRepository: Repository<IndexerEntity>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(IndexerService.name);
  }
}
