import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

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
  idlJson: JSON;

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
}
