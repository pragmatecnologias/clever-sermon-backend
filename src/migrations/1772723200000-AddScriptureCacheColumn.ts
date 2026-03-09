import { MigrationInterface, QueryRunner } from "typeorm";

export class AddScriptureCacheColumn1772723200000 implements MigrationInterface {
    name = 'AddScriptureCacheColumn1772723200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sermon_workspaces" ADD "scriptureCache" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sermon_workspaces" DROP COLUMN "scriptureCache"`);
    }
}
