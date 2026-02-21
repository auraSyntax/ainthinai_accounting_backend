import { IsString, IsNumber, IsDate, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvoiceLineItemDto {
  @IsString()
  description: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}

export class CreateInvoiceDto {
  @IsString()
  invoiceNumber: string;

  @IsDate()
  @Type(() => Date)
  invoiceDate: Date;

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsNumber()
  projectId?: number;

  @IsOptional()
  @IsNumber()
  vendorId?: number;

  @IsOptional()
  @IsNumber()
  incomeLedgerId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceLineItemDto)
  lineItems: CreateInvoiceLineItemDto[];

  @IsOptional()
  @IsString()
  narration?: string;
}

export class UpdateInvoiceDto {
  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  invoiceDate?: Date;

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsNumber()
  projectId?: number;

  @IsOptional()
  @IsNumber()
  vendorId?: number;

  @IsOptional()
  @IsNumber()
  incomeLedgerId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceLineItemDto)
  lineItems?: CreateInvoiceLineItemDto[];

  @IsOptional()
  @IsString()
  narration?: string;

  @IsOptional()
  @IsEnum(['Draft', 'Posted', 'Cancelled'])
  status?: string;
}

export class InvoiceLineItemResponseDto {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export class InvoiceResponseDto {
  id: number;
  invoiceNumber: string;
  invoiceDate: Date;
  customerId?: number;
  projectId?: number;
  vendorId?: number;
  incomeLedgerId?: number;
  totalAmount: number;
  narration?: string;
  status: string;
  lineItems: InvoiceLineItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

export class PostInvoiceDto {
  @IsOptional()
  @IsNumber()
  incomeLedgerId?: number;
}
