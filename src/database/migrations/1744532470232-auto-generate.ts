import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1744532470232 implements MigrationInterface {
  name = 'AutoGenerate1744532470232';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rpc" ("id" BIGSERIAL NOT NULL, "url" character varying(255) NOT NULL, "cluster" character varying(10) NOT NULL DEFAULT 'mainnet', CONSTRAINT "PK_2d541d87277ab022fc44c0a651d" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "rpc"`);
  }
}
