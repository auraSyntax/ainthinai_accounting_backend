import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AccountService } from '../../service/account-service';
import { CreateAccountDto, UpdateAccountDto } from '../dto/account.dto';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';

@Controller('api/v1/accounts')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(@Body() createDto: CreateAccountDto) {
    return await this.accountService.create(createDto);
  }

  @Get()
  async findAll() {
    return await this.accountService.findAll();
  }

  @Get('posting-accounts')
  async findPostingAccounts() {
    return await this.accountService.findPostingAccounts();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.accountService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdateAccountDto) {
    return await this.accountService.update(id, updateDto);
  }

  @Delete(':id')
  async disable(@Param('id') id: number) {
    await this.accountService.disable(id);
    return { message: 'Account disabled successfully' };
  }
}
