import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Bank } from './bank';
import { Cheque } from './cheque';

@Entity('cheque_books')
export class ChequeBook {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'bank_id' })
  bankId: number;

  @ManyToOne(() => Bank)
  @JoinColumn({ name: 'bank_id' })
  bank: Bank;

  @Column({ name: 'start_no', length: 20 })
  startNo: string;

  @Column({ name: 'end_no', length: 20 })
  endNo: string;

  @OneToMany(() => Cheque, (cheque) => cheque.chequeBook)
  cheques: Cheque[];

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
