import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { InvoiceService } from '../../service/invoice-service';
import { CreateInvoiceDto, UpdateInvoiceDto, PostInvoiceDto } from '../dto/invoice.dto';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';

@Controller('api/v1/invoices')
@UseGuards(JwtAuthGuard)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async create(@Body() createDto: CreateInvoiceDto) {
    return await this.invoiceService.create(createDto);
  }

  @Get()
  async findAll() {
    return await this.invoiceService.findAll();
  }

  @Get('by-status')
  async getByStatus(@Query('status') status: string) {
    return await this.invoiceService.getInvoicesByStatus(status);
  }

  @Get('customer/:customerId')
  async findByCustomer(@Param('customerId') customerId: number) {
    return await this.invoiceService.findByCustomer(customerId);
  }

  @Get('project/:projectId')
  async findByProject(@Param('projectId') projectId: number) {
    return await this.invoiceService.findByProject(projectId);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.invoiceService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdateInvoiceDto) {
    return await this.invoiceService.update(id, updateDto);
  }

  @Post(':id/post')
  async postInvoice(@Param('id') id: number, @Body() postDto?: PostInvoiceDto) {
    return await this.invoiceService.postInvoice(id, postDto);
  }

  @Post(':id/cancel')
  async cancelInvoice(@Param('id') id: number) {
    return await this.invoiceService.cancelInvoice(id);
  }

  @Delete(':id')
  async deleteInvoice(@Param('id') id: number) {
    await this.invoiceService.deleteInvoice(id);
    return { message: 'Invoice deleted successfully' };
  }
}
