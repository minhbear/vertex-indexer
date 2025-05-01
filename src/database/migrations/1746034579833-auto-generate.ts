import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1746034579833 implements MigrationInterface {
  name = 'AutoGenerate1746034579833';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "query_log" ADD "description" text NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "query_log" DROP COLUMN "description"`,
    );
  }
}
