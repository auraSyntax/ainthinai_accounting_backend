import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Customer } from './customer';
import { Vendor } from './vendor';
import { InvoiceLineItem } from './invoice-line-item';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'invoice_number', unique: true, length: 50 })
  invoiceNumber: string;

  @Column({ name: 'invoice_date', type: 'date' })
  invoiceDate: Date;

  @Column({ name: 'customer_id', nullable: true })
  customerId: number;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'project_id', nullable: true })
  projectId: number;

  @Column({ name: 'vendor_id', nullable: true })
  vendorId: number;

  @ManyToOne(() => Vendor, { nullable: true })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @Column({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number;

  @Column({ name: 'income_ledger_id', nullable: true })
  incomeLedgerId: number;

  @Column({ type: 'text', nullable: true })
  narration: string;

  @Column({
    type: 'enum',
    enum: ['Draft', 'Posted', 'Cancelled'],
    default: 'Draft',
  })
  status: string;

  @OneToMany(() => InvoiceLineItem, (item) => item.invoice, { cascade: true })
  lineItems: InvoiceLineItem[];

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
