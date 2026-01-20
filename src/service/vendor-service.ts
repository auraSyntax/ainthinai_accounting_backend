import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../entity/vendor';
import { CreateVendorDto, UpdateVendorDto } from '../api/dto/vendor.dto';
import { AccountService } from './account-service';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    private readonly accountService: AccountService,
  ) {}

  async create(createDto: CreateVendorDto): Promise<Vendor> {
    // Create vendor ledger account
    const vendorLedger = await this.createVendorLedger(createDto.name);

    const vendor = this.vendorRepository.create({
      name: createDto.name,
      phone: createDto.phone,
      email: createDto.email,
      address: createDto.address,
      ledgerAccountId: vendorLedger.id,
      status: createDto.status || 'Active',
    });

    const savedVendor = await this.vendorRepository.save(vendor);

    // TODO: If opening balance is provided, create opening journal entry
    // This will be implemented when journal module is created

    return savedVendor;
  }

  async findAll(): Promise<Vendor[]> {
    return await this.vendorRepository.find({
      relations: ['ledgerAccount'],
      order: { name: 'ASC' },
    });
  }

  async findById(id: number): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({
      where: { id },
      relations: ['ledgerAccount'],
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }

  async update(id: number, updateDto: UpdateVendorDto): Promise<Vendor> {
    const vendor = await this.findById(id);

    Object.assign(vendor, updateDto);
    return await this.vendorRepository.save(vendor);
  }

  async disable(id: number): Promise<void> {
    const vendor = await this.findById(id);
    vendor.status = 'Inactive';
    await this.vendorRepository.save(vendor);
  }

  private async createVendorLedger(vendorName: string) {
    // Find or create Vendors group account
    let vendorsGroup = await this.accountService.findByCode('VEND-GROUP');
    
    if (!vendorsGroup) {
      // Find or create Current Liabilities
      let currentLiabilities = await this.accountService.findByCode('CL');
      
      if (!currentLiabilities) {
        // Find or create Liabilities
        let liabilities = await this.accountService.findByCode('LIABILITIES');
        
        if (!liabilities) {
          liabilities = await this.accountService.findOrCreateSystemAccount(
            'LIABILITIES',
            'Liabilities',
            'Liability',
            'Credit',
          );
        }

        currentLiabilities = await this.accountService.findOrCreateSystemAccount(
          'CL',
          'Current Liabilities',
          'Liability',
          'Credit',
          liabilities.id,
        );
      }

      vendorsGroup = await this.accountService.findOrCreateSystemAccount(
        'VEND-GROUP',
        'Vendors',
        'Liability',
        'Credit',
        currentLiabilities.id,
      );
    }

    // Create vendor ledger
    const vendorCode = `VEND-${Date.now()}`;
    const vendorLedger = await this.accountService.create({
      accountCode: vendorCode,
      accountName: `Vendor - ${vendorName}`,
      accountType: 'Liability',
      normalBalance: 'Credit',
      isGroup: false,
      isSystem: false,
      isActive: true,
      parentId: vendorsGroup.id,
    });

    return vendorLedger;
  }
}
