import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import {
  IdlDappEntity,
  IndexerEntity,
  IndexerTableMetadataEntity,
  ISchemaTableDefinition,
} from 'src/database/entities';
import { Repository } from 'typeorm';
import { CreateIndexerSpaceDto, CreateTableDto } from './dtos/request.dto';
import { ResponseOk } from 'src/common/dtos/common.dto';
import { Transactional } from 'typeorm-transactional';
import { createSlug } from 'src/common/utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IndexerEventName } from 'src/common/enum/event.enum';

@Injectable()
export class IndexerService {
  constructor(
    protected readonly eventEmitter: EventEmitter2,
    @InjectRepository(IndexerEntity)
    private readonly indexerRepository: Repository<IndexerEntity>,
    @InjectRepository(IdlDappEntity)
    private readonly idlRepository: Repository<IdlDappEntity>,
    @InjectRepository(IndexerTableMetadataEntity)
    private readonly tableMetadataRepository: Repository<IndexerTableMetadataEntity>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(IndexerService.name);
  }

  async createIndexerSpace(input: CreateIndexerSpaceDto): Promise<ResponseOk> {
    const { accountId, idlId, name } = input;

    const idl = await this.findIdl(idlId);

    const slug = createSlug(name);
    const exitIndexerName = await this.indexerRepository.findOne({
      where: { slug, accountId },
    });
    if (exitIndexerName) {
      throw new BadRequestException('Indexer name already exists');
    }
    await this.indexerRepository.save({
      name,
      programId: idl.programId,
      idlId: idl.id,
      accountId,
    });

    this.eventEmitter.emit(IndexerEventName.INDEXER_CREATED, {
      programId: idl.programId,
    });

    return {
      statusCode: HttpStatus.CREATED,
    };
  }

  @Transactional()
  async createTable(input: CreateTableDto): Promise<ResponseOk> {
    const { indexerId, tableName, schema, accountId } = input;

    const indexer = await this.findIndexer(indexerId, accountId);

    const existingTable = await this.tableMetadataRepository.findOne({
      where: { tableName, indexerId },
    });
    if (existingTable) {
      throw new HttpException(
        'Table already exists in this indexer',
        HttpStatus.CONFLICT,
      );
    }

    const tableSchema: ISchemaTableDefinition[] = schema.map((column) => ({
      name: column.name,
      type: column.type,
      nullable: column.nullable ?? false,
    }));

    const newTableMetadata = this.tableMetadataRepository.create({
      tableName,
      fullTableName: `indexer_${indexer.slug}_${tableName}`,
      schema: tableSchema,
      indexerId,
      indexer,
    });
    await this.tableMetadataRepository.save(newTableMetadata);

    const createTableQuery = this.generateCreateTableQuery(
      newTableMetadata.fullTableName,
      tableSchema,
    );
    await this.tableMetadataRepository.query(createTableQuery);

    return { statusCode: HttpStatus.CREATED };
  }

  @Transactional()
  async deleteTable(input: {
    indexerId: number;
    tableName: string;
    accountId: number;
  }): Promise<ResponseOk> {
    const { indexerId, tableName, accountId } = input;

    const indexer = await this.findIndexer(indexerId, accountId);

    const tableMetadata = await this.tableMetadataRepository.findOne({
      where: { tableName, indexerId },
    });
    if (!tableMetadata) {
      throw new NotFoundException('Table not found');
    }

    const dropTableQuery = `DROP TABLE IF EXISTS ${tableMetadata.fullTableName};`;
    await this.tableMetadataRepository.query(dropTableQuery);

    await this.tableMetadataRepository.delete({
      tableName,
      indexerId,
    });

    return { statusCode: HttpStatus.OK };
  }

  private generateCreateTableQuery(
    tableName: string,
    schema: ISchemaTableDefinition[],
  ): string {
    const columnsDefinition = schema
      .map(
        (col) =>
          `${col.name} ${this.mapColumnType(col.type)} ${col.nullable ? 'NULL' : 'NOT NULL'}`,
      )
      .join(', ');

    return `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsDefinition});`;
  }

  private mapColumnType(type: string): string {
    const typeMap = {
      varbinary: 'VARBINARY(255)',
      varchar: 'VARCHAR(255)',
      uint256: 'BIGINT UNSIGNED',
      int256: 'BIGINT',
      integer: 'INT',
      double: 'DOUBLE',
      boolean: 'BOOLEAN',
      timestamp: 'TIMESTAMP',
      date: 'DATE',
      bigint: 'BIGINT',
    };

    return typeMap[type] || 'TEXT';
  }

  private async findIdl(idlId: number): Promise<IdlDappEntity> {
    const idl = await this.idlRepository.findOne({ where: { id: idlId } });
    if (!idl) {
      throw new NotFoundException(`Idl not found`);
    }
    return idl;
  }

  private async findIndexer(
    indexerId: number,
    accountId: number,
  ): Promise<IndexerEntity> {
    const indexer = await this.indexerRepository.findOne({
      where: { id: indexerId, accountId },
    });
    if (!indexer) {
      throw new NotFoundException(`Indexer not found`);
    }
    return indexer;
  }
}
