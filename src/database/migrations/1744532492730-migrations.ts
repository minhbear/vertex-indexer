import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1744532492730 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
       INSERT INTO "rpc" ("url", "cluster")
       VALUES 
        ('https://api.mainnet-beta.solana.com', 'mainnet'),
        ('https://api.testnet.solana.com', 'testnet'),
        ('https://api.devnet.solana.com', 'devnet')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "rpc" WHERE "url" IN (
        'https://api.mainnet-beta.solana.com',
        'https://api.testnet.solana.com',
        'https://api.devnet.solana.com'
      );
    `);
  }
}
