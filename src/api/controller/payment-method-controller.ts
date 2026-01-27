import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentMethodService } from '../../service/payment-method-service';
import { CreatePaymentMethodDto, UpdatePaymentMethodDto } from '../dto/payment-method.dto';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';
import { ApiResponse } from '../dto/response.dto';

@Controller('api/v1/payment-methods')
@UseGuards(JwtAuthGuard)
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post()
  async create(@Body() createDto: CreatePaymentMethodDto) {
    const data = await this.paymentMethodService.create(createDto);
    return ApiResponse.created(data, 'Payment method created successfully');
  }

  @Get()
  async findAll() {
    const data = await this.paymentMethodService.findAll();
    return ApiResponse.success(data, 'Payment methods fetched successfully');
  }

  @Get('active')
  async findActive() {
    const data = await this.paymentMethodService.findActive();
    return ApiResponse.success(data, 'Active payment methods fetched successfully');
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const data = await this.paymentMethodService.findById(id);
    return ApiResponse.success(data, 'Payment method fetched successfully');
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdatePaymentMethodDto) {
    const data = await this.paymentMethodService.update(id, updateDto);
    return ApiResponse.success(data, 'Payment method updated successfully');
  }

  @Delete(':id')
  async disable(@Param('id') id: number) {
    await this.paymentMethodService.disable(id);
    return ApiResponse.success(null, 'Payment method disabled successfully');
  }
}
