import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { VendorService } from '../../service/vendor-service';
import { CreateVendorDto, UpdateVendorDto } from '../dto/vendor.dto';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';

@Controller('api/v1/vendors')
@UseGuards(JwtAuthGuard)
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  async create(@Body() createDto: CreateVendorDto) {
    return await this.vendorService.create(createDto);
  }

  @Get()
  async findAll() {
    return await this.vendorService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.vendorService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdateVendorDto) {
    return await this.vendorService.update(id, updateDto);
  }

  @Delete(':id')
  async disable(@Param('id') id: number) {
    await this.vendorService.disable(id);
    return { message: 'Vendor disabled successfully' };
  }
}
