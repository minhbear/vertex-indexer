import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1744575205006 implements MigrationInterface {
  name = 'AutoGenerate1744575205006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "indexer_trigger"`);
    await queryRunner.query(`DELETE FROM "transformer_pda"`);
    await queryRunner.query(`DELETE FROM "indexer_table_metadata"`);
    await queryRunner.query(`DELETE FROM "indexer"`);

    await queryRunner.query(
      `ALTER TABLE "indexer" ADD "display_name" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer" ADD CONSTRAINT "UQ_9e6db4e565e639059d8a6b8ebe5" UNIQUE ("display_name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer" ALTER COLUMN "display_name" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer" ADD "description" text NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "indexer" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "indexer" DROP CONSTRAINT "UQ_9e6db4e565e639059d8a6b8ebe5"`,
    );
    await queryRunner.query(`ALTER TABLE "indexer" DROP COLUMN "display_name"`);
  }
}
