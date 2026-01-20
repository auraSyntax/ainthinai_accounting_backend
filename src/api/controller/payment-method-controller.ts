import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentMethodService } from '../../service/payment-method-service';
import { CreatePaymentMethodDto, UpdatePaymentMethodDto } from '../dto/payment-method.dto';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';

@Controller('api/v1/payment-methods')
@UseGuards(JwtAuthGuard)
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post()
  async create(@Body() createDto: CreatePaymentMethodDto) {
    return await this.paymentMethodService.create(createDto);
  }

  @Get()
  async findAll() {
    return await this.paymentMethodService.findAll();
  }

  @Get('active')
  async findActive() {
    return await this.paymentMethodService.findActive();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.paymentMethodService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdatePaymentMethodDto) {
    return await this.paymentMethodService.update(id, updateDto);
  }

  @Delete(':id')
  async disable(@Param('id') id: number) {
    await this.paymentMethodService.disable(id);
    return { message: 'Payment method disabled successfully' };
  }
}
