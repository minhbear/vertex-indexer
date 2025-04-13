import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1744587912972 implements MigrationInterface {
  name = 'AutoGenerate1744587912972';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "indexer" DROP CONSTRAINT "FK_8e0b36959a3345e739770ab3de4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer" ADD CONSTRAINT "FK_8e0b36959a3345e739770ab3de4" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "indexer" DROP CONSTRAINT "FK_8e0b36959a3345e739770ab3de4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer" ADD CONSTRAINT "FK_8e0b36959a3345e739770ab3de4" FOREIGN KEY ("account_id") REFERENCES "indexer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
