import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1748160100604 implements MigrationInterface {
  name = 'AutoGenerate1748160100604';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "UQ_4c8f96ccf523e9a3faefd5bdd4c"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "UQ_4c8f96ccf523e9a3faefd5bdd4c" UNIQUE ("email")`,
    );
  }
}
