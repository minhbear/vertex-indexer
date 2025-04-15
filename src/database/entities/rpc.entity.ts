import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Cluster {
  MAINNET = 'mainnet',
  DEVNET = 'devnet',
  TESTNET = 'testnet',
}

@Entity({ name: 'rpc' })
export class RpcEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({
    name: 'url',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  url: string;

  @Column({
    name: 'cluster',
    type: 'varchar',
    length: 10,
    nullable: false,
    default: Cluster.MAINNET,
  })
  cluster: Cluster;

  @Column({
    name: 'api_key',
    type: 'varchar',
    nullable: false,
    default: '',
  })
  apiKey: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isActive: boolean;
}
