import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1744732752152 implements MigrationInterface {
  name = 'AutoGenerate1744732752152';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "indexer" DROP CONSTRAINT "FK_104263db42a77d56d24c7ab7629"`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer" ALTER COLUMN "idl_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer" ADD CONSTRAINT "FK_104263db42a77d56d24c7ab7629" FOREIGN KEY ("idl_id") REFERENCES "idl_dapp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "indexer" DROP CONSTRAINT "FK_104263db42a77d56d24c7ab7629"`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer" ALTER COLUMN "idl_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer" ADD CONSTRAINT "FK_104263db42a77d56d24c7ab7629" FOREIGN KEY ("idl_id") REFERENCES "idl_dapp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
