import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoleTable1706012345678 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE roles (
                id BIGINT NOT NULL AUTO_INCREMENT,
                role_name VARCHAR(255) NOT NULL,
                role_description VARCHAR(500) NOT NULL,
                status BOOLEAN NOT NULL DEFAULT TRUE,
                PRIMARY KEY (id)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE roles`);
    }

}
