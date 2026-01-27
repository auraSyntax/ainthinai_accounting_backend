import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AccountService } from '../../service/account-service';
import { CreateAccountDto, UpdateAccountDto } from '../dto/account.dto';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';
import { ApiResponse } from '../dto/response.dto';

@Controller('api/v1/accounts')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(@Body() createDto: CreateAccountDto) {
    const data = await this.accountService.create(createDto);
    return ApiResponse.created(data, 'Account created successfully');
  }

  @Get()
  async findAll() {
    const data = await this.accountService.findAll();
    return ApiResponse.success(data, 'Accounts fetched successfully');
  }

  @Get('posting-accounts')
  async findPostingAccounts() {
    const data = await this.accountService.findPostingAccounts();
    return ApiResponse.success(data, 'Posting accounts fetched successfully');
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const data = await this.accountService.findById(id);
    return ApiResponse.success(data, 'Account fetched successfully');
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdateAccountDto) {
    const data = await this.accountService.update(id, updateDto);
    return ApiResponse.success(data, 'Account updated successfully');
  }

  @Delete(':id')
  async disable(@Param('id') id: number) {
    await this.accountService.disable(id);
    return ApiResponse.success(null, 'Account disabled successfully');
  }
}
