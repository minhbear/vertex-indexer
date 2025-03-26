import { TriggerType } from 'src/common/enum/common.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IndexerEntity } from './indexer.entity';
import { AbstractEntity } from './abstract.entity';
import { TransformerPdaEntity } from './transformer-pda.entity';
import { IndexerTableMetadataEntity } from './indexer-table-metadata.entity';

@Entity({
  name: 'indexer_trigger',
})
export class IndexerTriggerEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({
    name: 'trigger_type',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  triggerType: TriggerType;

  @Column({
    name: 'pda_pubkey',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  pdaPubkey: string;

  @Column({
    name: 'pda_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  pdaName: string;

  @Column({
    name: 'transformer_pda_id',
    type: 'bigint',
  })
  transformerPdaId: number;

  @ManyToOne(() => TransformerPdaEntity)
  @JoinColumn({ name: 'transformer_pda_id', referencedColumnName: 'id' })
  transformerPda: TransformerPdaEntity;

  @Column({
    name: 'indexer_table_id',
    type: 'bigint',
  })
  indexerTableId: number;

  @ManyToOne(() => IndexerTableMetadataEntity)
  @JoinColumn({ name: 'indexer_table_id', referencedColumnName: 'id' })
  indexerTable: IndexerTableMetadataEntity;

  @Column({
    name: 'indexer_id',
    type: 'bigint',
  })
  indexerId: number;

  @ManyToOne(() => IndexerEntity)
  @JoinColumn({ name: 'indexer_id', referencedColumnName: 'id' })
  indexer: IndexerEntity;
}
