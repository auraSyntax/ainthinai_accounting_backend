import { IsString, IsEnum, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateAccountDto {
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @IsString()
  accountCode: string;

  @IsString()
  accountName: string;

  @IsEnum(['Asset', 'Liability', 'Equity', 'Income', 'Expense'])
  accountType: string;

  @IsEnum(['Debit', 'Credit'])
  normalBalance: string;

  @IsBoolean()
  isGroup: boolean;

  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateAccountDto {
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @IsOptional()
  @IsString()
  accountCode?: string;

  @IsOptional()
  @IsString()
  accountName?: string;

  @IsOptional()
  @IsEnum(['Asset', 'Liability', 'Equity', 'Income', 'Expense'])
  accountType?: string;

  @IsOptional()
  @IsEnum(['Debit', 'Credit'])
  normalBalance?: string;

  @IsOptional()
  @IsBoolean()
  isGroup?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class AccountResponseDto {
  id: number;
  parentId?: number;
  accountCode: string;
  accountName: string;
  accountType: string;
  normalBalance: string;
  isGroup: boolean;
  isSystem: boolean;
  isActive: boolean;
  children?: AccountResponseDto[];
}
