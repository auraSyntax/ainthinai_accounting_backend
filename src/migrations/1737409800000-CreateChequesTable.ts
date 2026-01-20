import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateChequesTable1737409800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cheques',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'cheque_no',
            type: 'varchar',
            length: '20',
            isUnique: true,
          },
          {
            name: 'bank_id',
            type: 'int',
          },
          {
            name: 'cheque_book_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['Available', 'Used', 'Cancelled'],
            default: "'Available'",
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
      'cheques',
      new TableForeignKey({
        columnNames: ['bank_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'banks',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'cheques',
      new TableForeignKey({
        columnNames: ['cheque_book_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cheque_books',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('cheques');
  }
}
