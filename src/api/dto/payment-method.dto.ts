import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsString()
  methodName: string;

  @IsNumber()
  linkedLedgerId: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePaymentMethodDto {
  @IsOptional()
  @IsString()
  methodName?: string;

  @IsOptional()
  @IsNumber()
  linkedLedgerId?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class PaymentMethodResponseDto {
  id: number;
  methodName: string;
  linkedLedgerId: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
