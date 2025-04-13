import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1744532894000 implements MigrationInterface {
  name = 'AutoGenerate1744532894000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "indexer" ADD "cluster" character varying(10) NOT NULL DEFAULT 'mainnet'`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer" ADD "rpc_url" character varying(255) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer" ALTER COLUMN "cluster" SET DEFAULT 'mainnet'`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer" ALTER COLUMN "rpc_url" SET DEFAULT 'https://api.mainnet-beta.solana.com'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "indexer" DROP COLUMN "rpc_url"`);
    await queryRunner.query(`ALTER TABLE "indexer" DROP COLUMN "cluster"`);
  }
}
