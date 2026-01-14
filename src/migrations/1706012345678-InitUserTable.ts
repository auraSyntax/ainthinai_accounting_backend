import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1706012345678 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE users (
                id BIGINT NOT NULL AUTO_INCREMENT,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone_no VARCHAR(50) NOT NULL,
                registered_date_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                password VARCHAR(255) NOT NULL,
                is_active TINYINT(1) NOT NULL,
                profile VARCHAR(255) NOT NULL,
                role_id VARCHAR(100) NOT NULL,
                address VARCHAR(500) NOT NULL,
                reset_token VARCHAR(255) NULL,
                is_first_login TINYINT(1) NOT NULL,
                reset_token_expires TIMESTAMP NULL,
                PRIMARY KEY (id),
                UNIQUE KEY uk_users_email (email)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE users`);
    }

}
