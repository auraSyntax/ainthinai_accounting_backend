import { IsString, IsEmail, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  openingBalance?: number;

  @IsOptional()
  @IsEnum(['Active', 'Inactive'])
  status?: string;
}

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(['Active', 'Inactive'])
  status?: string;
}

export class CustomerResponseDto {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  ledgerAccountId?: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
