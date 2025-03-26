import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1742835679365 implements MigrationInterface {
  name = 'AutoGenerate1742835679365';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "indexer_trigger" ADD "transformer_pda_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer_trigger" ADD "indexer_table_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer_trigger" ADD CONSTRAINT "FK_74b8f8d3d93d019d1cb909c49c9" FOREIGN KEY ("transformer_pda_id") REFERENCES "transformer_pda"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer_trigger" ADD CONSTRAINT "FK_aa969493104c1d6fa24209cbcaf" FOREIGN KEY ("indexer_table_id") REFERENCES "indexer_table_metadata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "indexer_trigger" DROP CONSTRAINT "FK_aa969493104c1d6fa24209cbcaf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer_trigger" DROP CONSTRAINT "FK_74b8f8d3d93d019d1cb909c49c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer_trigger" DROP COLUMN "indexer_table_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer_trigger" DROP COLUMN "transformer_pda_id"`,
    );
  }
}
