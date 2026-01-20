import { IsString, IsEmail, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class CreateVendorDto {
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

export class UpdateVendorDto {
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

export class VendorResponseDto {
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
