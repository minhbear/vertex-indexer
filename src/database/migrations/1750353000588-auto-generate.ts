import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1750353000588 implements MigrationInterface {
  name = 'AutoGenerate1750353000588';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "indexer" ADD "is_active" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "indexer" DROP COLUMN "is_active"`);
  }
}
