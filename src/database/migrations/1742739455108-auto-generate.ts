import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1742739455108 implements MigrationInterface {
  name = 'AutoGenerate1742739455108';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "account" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "email" character varying(50) NOT NULL, "wallet_address" character varying(255) NOT NULL, CONSTRAINT "UQ_4c8f96ccf523e9a3faefd5bdd4c" UNIQUE ("email"), CONSTRAINT "UQ_490d081619917b210e1a2a0d6b6" UNIQUE ("wallet_address"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "idl_dapp" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "name" character varying(255) NOT NULL, "version" character varying(255) NOT NULL, "idl_json" json NOT NULL, "hash_id" character varying(255) NOT NULL, "program_id" character varying(255) NOT NULL, CONSTRAINT "UQ_77e3a66564c58902575fd2e95dc" UNIQUE ("hash_id"), CONSTRAINT "PK_c168478902425c0e7075ded17c3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "indexer" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "name" character varying(255) NOT NULL, "program_id" character varying(255) NOT NULL, "idl_id" bigint NOT NULL, "account_id" bigint NOT NULL, CONSTRAINT "PK_c4c8947d39912d44325b5233e84" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transformer_pda" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "script" text NOT NULL, "indexer_id" bigint NOT NULL, CONSTRAINT "PK_9b427c65c27252a83b078556a22" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "indexer_trigger" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "trigger_type" character varying(50) NOT NULL, "pda_pubkey" character varying(255) NOT NULL, "indexer_id" bigint NOT NULL, CONSTRAINT "PK_d4e357ca63aa5d11ce817c66499" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "query_log" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "query" text NOT NULL, "indexer_id" bigint NOT NULL, CONSTRAINT "PK_2dcb03c735e758040860d71f9e7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "indexer_table_metadata" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "table_name" character varying(255) NOT NULL, "full_table_name" character varying(255) NOT NULL, "schema" json NOT NULL, "indexer_id" bigint NOT NULL, CONSTRAINT "PK_2a6ec648979f875a4f9eef68b47" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer" ADD CONSTRAINT "FK_104263db42a77d56d24c7ab7629" FOREIGN KEY ("idl_id") REFERENCES "idl_dapp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer" ADD CONSTRAINT "FK_8e0b36959a3345e739770ab3de4" FOREIGN KEY ("account_id") REFERENCES "indexer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transformer_pda" ADD CONSTRAINT "FK_31cfce4378e98db6f921376d627" FOREIGN KEY ("indexer_id") REFERENCES "indexer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer_trigger" ADD CONSTRAINT "FK_eec617a27823ea18eae72848454" FOREIGN KEY ("indexer_id") REFERENCES "indexer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "query_log" ADD CONSTRAINT "FK_9da2dfc37705f34c40c9e6276b0" FOREIGN KEY ("indexer_id") REFERENCES "indexer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer_table_metadata" ADD CONSTRAINT "FK_592447276dccbaa1300feffff7a" FOREIGN KEY ("indexer_id") REFERENCES "indexer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "indexer_table_metadata" DROP CONSTRAINT "FK_592447276dccbaa1300feffff7a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "query_log" DROP CONSTRAINT "FK_9da2dfc37705f34c40c9e6276b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer_trigger" DROP CONSTRAINT "FK_eec617a27823ea18eae72848454"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transformer_pda" DROP CONSTRAINT "FK_31cfce4378e98db6f921376d627"`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer" DROP CONSTRAINT "FK_8e0b36959a3345e739770ab3de4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "indexer" DROP CONSTRAINT "FK_104263db42a77d56d24c7ab7629"`,
    );
    await queryRunner.query(`DROP TABLE "indexer_table_metadata"`);
    await queryRunner.query(`DROP TABLE "query_log"`);
    await queryRunner.query(`DROP TABLE "indexer_trigger"`);
    await queryRunner.query(`DROP TABLE "transformer_pda"`);
    await queryRunner.query(`DROP TABLE "indexer"`);
    await queryRunner.query(`DROP TABLE "idl_dapp"`);
    await queryRunner.query(`DROP TABLE "account"`);
  }
}
