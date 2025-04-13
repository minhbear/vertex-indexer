import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1744585411634 implements MigrationInterface {
  name = 'AutoGenerate1744585411634';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "indexer" DROP CONSTRAINT "UQ_9e6db4e565e639059d8a6b8ebe5"`,
    );
    await queryRunner.query(`ALTER TABLE "indexer" DROP COLUMN "display_name"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "indexer" ADD "display_name" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer" ADD CONSTRAINT "UQ_9e6db4e565e639059d8a6b8ebe5" UNIQUE ("display_name")`,
    );
  }
}
