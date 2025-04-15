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
  AccountEntity,
  IdlDappEntity,
  IndexerEntity,
  IndexerTableMetadataEntity,
  IndexerTriggerEntity,
  ISchemaTableDefinition,
  TransformerPdaEntity,
} from 'src/database/entities';
import { Repository } from 'typeorm';
import {
  CreateIndexerSpaceDto,
  CreateTableDto,
  RegisterIndexerWithTransformDto,
} from './dtos/request.dto';
import { Transactional } from 'typeorm-transactional';
import { createSlug } from 'src/common/utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IndexerEventName } from 'src/common/enum/event.enum';
import { RpcService } from 'src/rpc/rpc.service';

@Injectable()
export class IndexerService {
  constructor(
    private readonly rpcService: RpcService,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(IndexerEntity)
    private readonly indexerRepository: Repository<IndexerEntity>,
    @InjectRepository(IdlDappEntity)
    private readonly idlRepository: Repository<IdlDappEntity>,
    @InjectRepository(IndexerTableMetadataEntity)
    private readonly tableMetadataRepository: Repository<IndexerTableMetadataEntity>,
    @InjectRepository(TransformerPdaEntity)
    private readonly transformerPdaRepository: Repository<TransformerPdaEntity>,
    @InjectRepository(IndexerTriggerEntity)
    private readonly indexerTriggerRepository: Repository<IndexerTriggerEntity>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(IndexerService.name);
  }

  async createIndexerSpace(
    input: CreateIndexerSpaceDto,
    account: AccountEntity,
  ): Promise<void> {
    const { idlId, name, rpcId, description, programId } = input;

    const rpc = await this.rpcService.findById(rpcId);

    let idl: IdlDappEntity | null = null;
    if (idlId) {
      idl = await this.findIdl(idlId);
    }

    const slug = createSlug(name);
    const exitIndexerName = await this.indexerRepository.findOne({
      where: { slug, accountId: account.id },
    });
    if (exitIndexerName) {
      throw new BadRequestException('Indexer name already exists');
    }
    await this.indexerRepository.save({
      name,
      programId,
      idlId: idl?.id,
      accountId: account.id,
      slug,
      cluster: rpc.cluster,
      rpcUrl: this.rpcService.getFullHttpUrl(rpc),
      description,
    });

    this.eventEmitter.emit(IndexerEventName.INDEXER_CREATED, {
      programId,
      cluster: rpc.cluster,
    });
  }

  async getIndexers(accountId: number): Promise<IndexerEntity[]> {
    const indexers = await this.indexerRepository
      .createQueryBuilder('indexer')
      .leftJoinAndSelect('indexer.idl', 'idl')
      .leftJoinAndSelect('indexer.indexerTriggers', 'triggers')
      .where('indexer.accountId = :accountId', { accountId })
      .orderBy('indexer.createdAt', 'DESC')
      .getMany();

    return indexers;
  }

  async getAllIndexerTriggerAndTransformOfTable(input: {
    indexerId: number;
    accountId: number;
    tableId: number;
  }): Promise<IndexerTriggerEntity[]> {
    const { indexerId, tableId, accountId } = input;

    await this.findIndexer(indexerId, accountId);

    return await this.indexerTriggerRepository
      .createQueryBuilder('trigger')
      .innerJoin('trigger.indexerTable', 'table')
      .innerJoinAndSelect('trigger.transformerPda', 'transformer')
      .where('trigger.indexerId = :indexerId', { indexerId })
      .andWhere('table.id = :tableId', { tableId })
      .orderBy('trigger.createdAt', 'DESC')
      .getMany();
  }

  @Transactional()
  async createTable(
    input: CreateTableDto,
    account: AccountEntity,
  ): Promise<void> {
    const { indexerId, tableName, schema } = input;

    const indexer = await this.findIndexer(indexerId, account.id);

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
      fullTableName: `${account.userName}_${indexer.slug}_${tableName}`,
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
  }

  @Transactional()
  async deleteTable(input: {
    indexerId: number;
    tableName: string;
    accountId: number;
  }): Promise<void> {
    const { indexerId, tableName, accountId } = input;

    await this.findIndexer(indexerId, accountId);

    const tableMetadata = await this.tableMetadataRepository.findOne({
      where: { tableName, indexerId },
    });
    if (!tableMetadata) {
      throw new NotFoundException('Table not found');
    }

    await this.tableMetadataRepository.query(`
      DELETE FROM indexer_trigger WHERE indexer_table_id = ${tableMetadata.id};  
    `);

    const dropTableQuery = `DROP TABLE IF EXISTS ${tableMetadata.fullTableName};`;
    await this.tableMetadataRepository.query(dropTableQuery);

    await this.tableMetadataRepository.delete({
      tableName,
      indexerId,
    });
  }

  async getAllTablesInIndexer(
    indexerId: number,
    accountId: number,
  ): Promise<IndexerTableMetadataEntity[]> {
    const indexer = await this.findIndexer(indexerId, accountId);

    return await this.tableMetadataRepository.find({
      where: { indexerId: indexer.id },
      order: { createdAt: 'DESC' },
    });
  }

  @Transactional()
  async registerIndexerWithTransform(
    input: RegisterIndexerWithTransformDto,
    fileContent: string,
  ): Promise<void> {
    const indexer = await this.findIndexer(input.indexerId, input.accountId);

    const transformId = (
      await this.transformerPdaRepository
        .createQueryBuilder()
        .insert()
        .values({
          indexerId: indexer.id,
          script: fileContent,
        })
        .returning('id')
        .execute()
    ).raw[0].id;

    const tableMetadata = await this.findTableMetadata(
      indexer.id,
      input.tableId,
    );

    await this.indexerTriggerRepository.save({
      indexerId: indexer.id,
      indexerTableId: tableMetadata.id,
      pdaName: input.pdaName,
      pdaPubkey: input.pdaPubkey,
      triggerType: input.triggerType,
      transformerPdaId: transformId,
    });
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

  private async findTableMetadata(
    indexerId: number,
    tableId: number,
  ): Promise<IndexerTableMetadataEntity> {
    const tableMetadata = await this.tableMetadataRepository.findOne({
      where: { id: tableId, indexerId },
    });
    if (!tableMetadata) {
      throw new NotFoundException(`Table not found`);
    }
    return tableMetadata;
  }
}
