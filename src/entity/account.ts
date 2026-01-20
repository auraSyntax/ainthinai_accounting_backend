import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @ManyToOne(() => Account, (account) => account.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Account;

  @OneToMany(() => Account, (account) => account.parent)
  children: Account[];

  @Column({ name: 'account_code', unique: true, length: 50 })
  accountCode: string;

  @Column({ name: 'account_name', length: 255 })
  accountName: string;

  @Column({
    name: 'account_type',
    type: 'enum',
    enum: ['Asset', 'Liability', 'Equity', 'Income', 'Expense'],
  })
  accountType: string;

  @Column({
    name: 'normal_balance',
    type: 'enum',
    enum: ['Debit', 'Credit'],
  })
  normalBalance: string;

  @Column({ name: 'is_group', default: false })
  isGroup: boolean;

  @Column({ name: 'is_system', default: false })
  isSystem: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
