import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Idl } from '@coral-xyz/anchor';
import { Idl as IdlV31 } from 'anchor-v31';
import { Cluster } from './rpc.entity';

@Entity({
  name: 'idl_dapp',
})
export class IdlDappEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'version',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  version: string;

  @Column({
    name: 'idl_json',
    type: 'json',
    nullable: false,
  })
  idlJson: Idl | IdlV31;

  @Column({
    name: 'hash_id',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  hashId: string;

  @Column({
    name: 'program_id',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  programId: string;

  @Column({
    name: 'network',
    type: 'varchar',
    length: 10,
    nullable: false,
    default: Cluster.MAINNET,
  })
  network: Cluster;
}
