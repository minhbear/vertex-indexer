import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class AbstractEntity {
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp without time zone',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp without time zone',
    nullable: false,
  })
  updatedAt: Date;
}
