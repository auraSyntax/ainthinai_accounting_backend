import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateChequeBooksTable1737409700000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cheque_books',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'bank_id',
            type: 'int',
          },
          {
            name: 'start_no',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'end_no',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'cheque_books',
      new TableForeignKey({
        columnNames: ['bank_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'banks',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('cheque_books');
  }
}
