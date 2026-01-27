import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CustomerService } from '../../service/customer-service';
import { CreateCustomerDto, UpdateCustomerDto } from '../dto/customer.dto';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';
import { ApiResponse } from '../dto/response.dto';

@Controller('api/v1/customers')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async create(@Body() createDto: CreateCustomerDto) {
    const data = await this.customerService.create(createDto);
    return ApiResponse.created(data, 'Customer created successfully');
  }

  @Get()
  async findAll() {
    const data = await this.customerService.findAll();
    return ApiResponse.success(data, 'Customers fetched successfully');
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const data = await this.customerService.findById(id);
    return ApiResponse.success(data, 'Customer fetched successfully');
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdateCustomerDto) {
    const data = await this.customerService.update(id, updateDto);
    return ApiResponse.success(data, 'Customer updated successfully');
  }

  @Delete(':id')
  async disable(@Param('id') id: number) {
    await this.customerService.disable(id);
    return ApiResponse.success(null, 'Customer disabled successfully');
  }
}
