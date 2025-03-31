import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1743270145856 implements MigrationInterface {
  name = 'AutoGenerate1743270145856';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "indexer" ADD "slug" character varying(255) NULL`,
    );
    await queryRunner.query(`UPDATE "indexer" SET "slug" = "name"`);
    await queryRunner.query(
      `ALTER TABLE "indexer" ALTER COLUMN "slug" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "indexer" DROP COLUMN "slug"`);
  }
}
