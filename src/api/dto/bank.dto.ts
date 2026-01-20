import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class CreateBankDto {
  @IsString()
  bankName: string;

  @IsString()
  accountNumber: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsNumber()
  openingBalance?: number;

  @IsOptional()
  @IsEnum(['Active', 'Inactive'])
  status?: string;
}

export class UpdateBankDto {
  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsEnum(['Active', 'Inactive'])
  status?: string;
}

export class BankResponseDto {
  id: number;
  bankName: string;
  accountNumber: string;
  branch?: string;
  openingBalance: number;
  ledgerAccountId?: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
