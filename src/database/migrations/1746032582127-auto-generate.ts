import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1746032582127 implements MigrationInterface {
  name = 'AutoGenerate1746032582127';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rpc" DROP COLUMN "api_key"`);
    await queryRunner.query(`ALTER TABLE "indexer" DROP COLUMN "rpc_url"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "indexer" ADD "rpc_url" character varying(255) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "rpc" ADD "api_key" character varying NOT NULL DEFAULT ''`,
    );
  }
}
