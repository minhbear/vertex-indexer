import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1744533494043 implements MigrationInterface {
  name = 'AutoGenerate1744533494043';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rpc" ADD "api_key" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer" ALTER COLUMN "rpc_url" SET DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "indexer" ALTER COLUMN "rpc_url" SET DEFAULT 'api.mainnet-beta.solana.com'`,
    );
    await queryRunner.query(`ALTER TABLE "rpc" DROP COLUMN "api_key"`);
  }
}
