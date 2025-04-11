import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1744411533780 implements MigrationInterface {
  name = 'AutoGenerate1744411533780';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "UQ_490d081619917b210e1a2a0d6b6"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "UQ_490d081619917b210e1a2a0d6b6" UNIQUE ("wallet_address")`,
    );
  }
}
