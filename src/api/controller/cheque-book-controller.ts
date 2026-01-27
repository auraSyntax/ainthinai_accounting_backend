import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ChequeBookService } from '../../service/cheque-book-service';
import { CreateChequeBookDto, UpdateChequeBookDto, UpdateChequeStatusDto } from '../dto/cheque-book.dto';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';
import { ApiResponse } from '../dto/response.dto';

@Controller('api/v1/cheque-books')
@UseGuards(JwtAuthGuard)
export class ChequeBookController {
  constructor(private readonly chequeBookService: ChequeBookService) {}

  @Post()
  async create(@Body() createDto: CreateChequeBookDto) {
    const data = await this.chequeBookService.create(createDto);
    return ApiResponse.created(data, 'Cheque book created successfully');
  }

  @Get()
  async findAll() {
    const data = await this.chequeBookService.findAll();
    return ApiResponse.success(data, 'Cheque books fetched successfully');
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const data = await this.chequeBookService.findById(id);
    return ApiResponse.success(data, 'Cheque book fetched successfully');
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdateChequeBookDto) {
    const data = await this.chequeBookService.update(id, updateDto);
    return ApiResponse.success(data, 'Cheque book updated successfully');
  }

  @Get(':id/cheques')
  async findChequesByBook(@Param('id') id: number) {
    const data = await this.chequeBookService.findChequesByBook(id);
    return ApiResponse.success(data, 'Cheques fetched successfully');
  }

  @Get('cheque/:chequeNo')
  async findChequeByNumber(@Param('chequeNo') chequeNo: string) {
    const data = await this.chequeBookService.findChequeByNumber(chequeNo);
    return ApiResponse.success(data, 'Cheque fetched successfully');
  }

  @Put('cheque/:chequeNo/status')
  async updateChequeStatus(
    @Param('chequeNo') chequeNo: string,
    @Body() updateDto: UpdateChequeStatusDto,
  ) {
    const data = await this.chequeBookService.updateChequeStatus(chequeNo, updateDto);
    return ApiResponse.success(data, 'Cheque status updated successfully');
  }

  @Get('bank/:bankId/available-cheques')
  async findAvailableCheques(@Param('bankId') bankId: number) {
    const data = await this.chequeBookService.findAvailableCheques(bankId);
    return ApiResponse.success(data, 'Available cheques fetched successfully');
  }
}
