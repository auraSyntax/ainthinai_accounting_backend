import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BankService } from '../../service/bank-service';
import { CreateBankDto, UpdateBankDto } from '../dto/bank.dto';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';

@Controller('api/v1/banks')
@UseGuards(JwtAuthGuard)
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post()
  async create(@Body() createDto: CreateBankDto) {
    return await this.bankService.create(createDto);
  }

  @Get()
  async findAll() {
    return await this.bankService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.bankService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdateBankDto) {
    return await this.bankService.update(id, updateDto);
  }

  @Delete(':id')
  async disable(@Param('id') id: number) {
    await this.bankService.disable(id);
    return { message: 'Bank disabled successfully' };
  }
}
