import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1744535515944 implements MigrationInterface {
  name = 'AutoGenerate1744535515944';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "idl_dapp" ADD "network" character varying(10) NOT NULL DEFAULT 'mainnet'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "idl_dapp" DROP COLUMN "network"`);
  }
}
