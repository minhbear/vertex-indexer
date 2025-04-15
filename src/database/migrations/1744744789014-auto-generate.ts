import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1744744789014 implements MigrationInterface {
  name = 'AutoGenerate1744744789014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rpc" ADD "is_active" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rpc" DROP COLUMN "is_active"`);
  }
}
