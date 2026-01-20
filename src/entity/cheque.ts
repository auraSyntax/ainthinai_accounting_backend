import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Bank } from './bank';
import { ChequeBook } from './cheque-book';

@Entity('cheques')
export class Cheque {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cheque_no', length: 20, unique: true })
  chequeNo: string;

  @Column({ name: 'bank_id' })
  bankId: number;

  @ManyToOne(() => Bank)
  @JoinColumn({ name: 'bank_id' })
  bank: Bank;

  @Column({ name: 'cheque_book_id', nullable: true })
  chequeBookId: number;

  @ManyToOne(() => ChequeBook, (chequeBook) => chequeBook.cheques)
  @JoinColumn({ name: 'cheque_book_id' })
  chequeBook: ChequeBook;

  @Column({
    type: 'enum',
    enum: ['Available', 'Used', 'Cancelled'],
    default: 'Available',
  })
  status: string;

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
