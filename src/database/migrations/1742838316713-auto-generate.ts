import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1742838316713 implements MigrationInterface {
  name = 'AutoGenerate1742838316713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "indexer_trigger" ADD "pda_name" character varying(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "indexer_trigger" DROP COLUMN "pda_name"`,
    );
  }
}
