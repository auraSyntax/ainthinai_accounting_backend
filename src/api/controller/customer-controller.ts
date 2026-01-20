import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CustomerService } from '../../service/customer-service';
import { CreateCustomerDto, UpdateCustomerDto } from '../dto/customer.dto';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';

@Controller('api/v1/customers')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async create(@Body() createDto: CreateCustomerDto) {
    return await this.customerService.create(createDto);
  }

  @Get()
  async findAll() {
    return await this.customerService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.customerService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdateCustomerDto) {
    return await this.customerService.update(id, updateDto);
  }

  @Delete(':id')
  async disable(@Param('id') id: number) {
    await this.customerService.disable(id);
    return { message: 'Customer disabled successfully' };
  }
}
