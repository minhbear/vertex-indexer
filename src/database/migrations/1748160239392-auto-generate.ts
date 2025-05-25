import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1748160239392 implements MigrationInterface {
  name = 'AutoGenerate1748160239392';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "user_name" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "user_name" SET NOT NULL`,
    );
  }
}
