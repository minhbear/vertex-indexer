import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1748160308168 implements MigrationInterface {
  name = 'AutoGenerate1748160308168';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "email" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "email" SET NOT NULL`,
    );
  }
}
