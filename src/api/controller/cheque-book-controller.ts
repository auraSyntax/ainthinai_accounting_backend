import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ChequeBookService } from '../../service/cheque-book-service';
import { CreateChequeBookDto, UpdateChequeBookDto, UpdateChequeStatusDto } from '../dto/cheque-book.dto';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';

@Controller('api/v1/cheque-books')
@UseGuards(JwtAuthGuard)
export class ChequeBookController {
  constructor(private readonly chequeBookService: ChequeBookService) {}

  @Post()
  async create(@Body() createDto: CreateChequeBookDto) {
    return await this.chequeBookService.create(createDto);
  }

  @Get()
  async findAll() {
    return await this.chequeBookService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.chequeBookService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdateChequeBookDto) {
    return await this.chequeBookService.update(id, updateDto);
  }

  @Get(':id/cheques')
  async findChequesByBook(@Param('id') id: number) {
    return await this.chequeBookService.findChequesByBook(id);
  }

  @Get('cheque/:chequeNo')
  async findChequeByNumber(@Param('chequeNo') chequeNo: string) {
    return await this.chequeBookService.findChequeByNumber(chequeNo);
  }

  @Put('cheque/:chequeNo/status')
  async updateChequeStatus(
    @Param('chequeNo') chequeNo: string,
    @Body() updateDto: UpdateChequeStatusDto,
  ) {
    return await this.chequeBookService.updateChequeStatus(chequeNo, updateDto);
  }

  @Get('bank/:bankId/available-cheques')
  async findAvailableCheques(@Param('bankId') bankId: number) {
    return await this.chequeBookService.findAvailableCheques(bankId);
  }
}
