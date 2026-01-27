import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BankService } from '../../service/bank-service';
import { CreateBankDto, UpdateBankDto } from '../dto/bank.dto';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';
import { ApiResponse } from '../dto/response.dto';

@Controller('api/v1/banks')
@UseGuards(JwtAuthGuard)
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post()
  async create(@Body() createDto: CreateBankDto) {
    const data = await this.bankService.create(createDto);
    return ApiResponse.created(data, 'Bank account created successfully');
  }

  @Get()
  async findAll() {
    const data = await this.bankService.findAll();
    return ApiResponse.success(data, 'Bank accounts fetched successfully');
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const data = await this.bankService.findById(id);
    return ApiResponse.success(data, 'Bank account fetched successfully');
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdateBankDto) {
    const data = await this.bankService.update(id, updateDto);
    return ApiResponse.success(data, 'Bank account updated successfully');
  }

  @Delete(':id')
  async disable(@Param('id') id: number) {
    await this.bankService.disable(id);
    return ApiResponse.success(null, 'Bank account disabled successfully');
  }
}
