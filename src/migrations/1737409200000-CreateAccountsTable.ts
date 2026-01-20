import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateAccountsTable1737409200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'accounts',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'parent_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'account_code',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'account_name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'account_type',
            type: 'enum',
            enum: ['Asset', 'Liability', 'Equity', 'Income', 'Expense'],
          },
          {
            name: 'normal_balance',
            type: 'enum',
            enum: ['Debit', 'Credit'],
          },
          {
            name: 'is_group',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_system',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
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

    // Add self-referencing foreign key for parent_id
    await queryRunner.createForeignKey(
      'accounts',
      new TableForeignKey({
        columnNames: ['parent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'accounts',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('accounts');
  }
}
