import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'phone_no' })
  phoneNo: string;

  @CreateDateColumn({ type: 'timestamp', name: 'registered_date_time' })
  registeredDateTime: Date;

  @Column()
  password: string;

  @Column({ name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'profile' })
  profile: string;

  @Column({ name: 'role_id' })
  roleId?: number;

  @Column({ name: 'address' })
  address: string;

  @Column({ name: 'reset_token', nullable: true })
  resetToken: string;

  @Column({ name: 'is_first_login' })
  isFirstLogin: boolean;

  @Column({name: 'reset_token_expires', nullable: true })
  resetTokenExpires: Date;
}