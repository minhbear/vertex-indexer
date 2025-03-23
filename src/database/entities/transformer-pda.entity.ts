import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { IndexerEntity } from './indexer.entity';

@Entity({ name: 'transformer_pda' })
export class TransformerPdaEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({
    name: 'script',
    type: 'text',
    nullable: false,
  })
  script: string;

  @Column({
    name: 'indexer_id',
    type: 'bigint',
  })
  indexerId: number;

  @ManyToOne(() => IndexerEntity)
  @JoinColumn({ name: 'indexer_id', referencedColumnName: 'id' })
  indexer: IndexerEntity;
}
