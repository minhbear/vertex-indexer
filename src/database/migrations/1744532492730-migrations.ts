import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1744532492730 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
       INSERT INTO "rpc" ("url", "cluster")
       VALUES 
        ('api.mainnet-beta.solana.com', 'mainnet'),
        ('api.testnet.solana.com', 'testnet'),
        ('api.devnet.solana.com', 'devnet')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "rpc" WHERE "url" IN (
        'api.mainnet-beta.solana.com',
        'api.testnet.solana.com',
        'api.devnet.solana.com'
      );
    `);
  }
}
