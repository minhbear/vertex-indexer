import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1744576226723 implements MigrationInterface {
  name = 'AutoGenerate1744576226723';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "account"`);
    await queryRunner.query(
      `ALTER TABLE "account" ADD "user_name" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "UQ_4d258da1f4c854e589909d4260b" UNIQUE ("user_name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD "is_updated_user_name" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP COLUMN "is_updated_user_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "UQ_4d258da1f4c854e589909d4260b"`,
    );
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "user_name"`);
  }
}
