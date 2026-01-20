import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateChequeBookDto {
  @IsNumber()
  bankId: number;

  @IsString()
  startNo: string;

  @IsString()
  endNo: string;
}

export class UpdateChequeBookDto {
  @IsOptional()
  @IsNumber()
  bankId?: number;

  @IsOptional()
  @IsString()
  startNo?: string;

  @IsOptional()
  @IsString()
  endNo?: string;
}

export class ChequeBookResponseDto {
  id: number;
  bankId: number;
  startNo: string;
  endNo: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateChequeStatusDto {
  @IsEnum(['Available', 'Used', 'Cancelled'])
  status: string;
}

export class ChequeResponseDto {
  id: number;
  chequeNo: string;
  bankId: number;
  chequeBookId?: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
