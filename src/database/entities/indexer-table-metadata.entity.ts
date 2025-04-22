import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { IndexerEntity } from './indexer.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IndexerTriggerEntity } from './indexer-trigger.entity';

export class ISchemaTableDefinition {
  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  nullable: boolean;
}

@Entity({ name: 'indexer_table_metadata' })
export class IndexerTableMetadataEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({
    name: 'table_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  tableName: string;

  @Column({
    name: 'full_table_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  fullTableName: string;

  @Column({
    name: 'schema',
    type: 'json',
    nullable: false,
  })
  schema: ISchemaTableDefinition[];

  @Column({
    name: 'indexer_id',
    type: 'bigint',
  })
  indexerId: number;

  @ManyToOne(() => IndexerEntity)
  @JoinColumn({ name: 'indexer_id', referencedColumnName: 'id' })
  indexer: IndexerEntity;

  @OneToMany(
    () => IndexerTriggerEntity,
    (indexerTrigger) => indexerTrigger.indexerTable,
  )
  indexerTriggers: IndexerTriggerEntity[];
}
