import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { VendorService } from '../../service/vendor-service';
import { CreateVendorDto, UpdateVendorDto } from '../dto/vendor.dto';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';
import { ApiResponse } from '../dto/response.dto';

@Controller('api/v1/vendors')
@UseGuards(JwtAuthGuard)
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  async create(@Body() createDto: CreateVendorDto) {
    const data = await this.vendorService.create(createDto);
    return ApiResponse.created(data, 'Vendor created successfully');
  }

  @Get()
  async findAll() {
    const data = await this.vendorService.findAll();
    return ApiResponse.success(data, 'Vendors fetched successfully');
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const data = await this.vendorService.findById(id);
    return ApiResponse.success(data, 'Vendor fetched successfully');
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdateVendorDto) {
    const data = await this.vendorService.update(id, updateDto);
    return ApiResponse.success(data, 'Vendor updated successfully');
  }

  @Delete(':id')
  async disable(@Param('id') id: number) {
    await this.vendorService.disable(id);
    return ApiResponse.success(null, 'Vendor disabled successfully');
  }
}
