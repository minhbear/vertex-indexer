import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { IndexerEntity } from './indexer.entity';

@Entity({
  name: 'query_log',
})
export class QueryLogEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({
    name: 'description',
    type: 'text',
    default: '',
  })
  description: string;

  @Column({
    name: 'query',
    type: 'text',
    nullable: false,
  })
  query: string;

  @Column({
    name: 'indexer_id',
    type: 'bigint',
  })
  indexerId: number;

  @ManyToOne(() => IndexerEntity)
  @JoinColumn({ name: 'indexer_id', referencedColumnName: 'id' })
  indexer: IndexerEntity;
}
