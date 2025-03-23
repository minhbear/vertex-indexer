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
    name: 'indexer_id',
    type: 'bigint',
  })
  indexerId: number;

  @ManyToOne(() => IndexerEntity)
  @JoinColumn({ name: 'indexer_id', referencedColumnName: 'id' })
  indexer: IndexerEntity;
}
