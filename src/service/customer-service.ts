import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entity/customer';
import { CreateCustomerDto, UpdateCustomerDto } from '../api/dto/customer.dto';
import { AccountService } from './account-service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly accountService: AccountService,
  ) {}

  async create(createDto: CreateCustomerDto): Promise<Customer> {
    // Create customer ledger account
    const customerLedger = await this.createCustomerLedger(createDto.name);

    const customer = this.customerRepository.create({
      name: createDto.name,
      phone: createDto.phone,
      email: createDto.email,
      address: createDto.address,
      ledgerAccountId: customerLedger.id,
      status: createDto.status || 'Active',
    });

    const savedCustomer = await this.customerRepository.save(customer);

    // TODO: If opening balance is provided, create opening journal entry
    // This will be implemented when journal module is created

    return savedCustomer;
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find({
      relations: ['ledgerAccount'],
      order: { name: 'ASC' },
    });
  }

  async findById(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['ledgerAccount'],
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(id: number, updateDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findById(id);

    Object.assign(customer, updateDto);
    return await this.customerRepository.save(customer);
  }

  async disable(id: number): Promise<void> {
    const customer = await this.findById(id);
    customer.status = 'Inactive';
    await this.customerRepository.save(customer);
  }

  private async createCustomerLedger(customerName: string) {
    // Find or create Customers group account
    let customersGroup = await this.accountService.findByCode('CUST-GROUP');
    
    if (!customersGroup) {
      // Find or create Current Assets
      let currentAssets = await this.accountService.findByCode('CA');
      
      if (!currentAssets) {
        // Find or create Assets
        let assets = await this.accountService.findByCode('ASSETS');
        
        if (!assets) {
          assets = await this.accountService.findOrCreateSystemAccount(
            'ASSETS',
            'Assets',
            'Asset',
            'Debit',
          );
        }

        currentAssets = await this.accountService.findOrCreateSystemAccount(
          'CA',
          'Current Assets',
          'Asset',
          'Debit',
          assets.id,
        );
      }

      customersGroup = await this.accountService.findOrCreateSystemAccount(
        'CUST-GROUP',
        'Customers',
        'Asset',
        'Debit',
        currentAssets.id,
      );
    }

    // Create customer ledger
    const customerCode = `CUST-${Date.now()}`;
    const customerLedger = await this.accountService.create({
      accountCode: customerCode,
      accountName: `Customer - ${customerName}`,
      accountType: 'Asset',
      normalBalance: 'Debit',
      isGroup: false,
      isSystem: false,
      isActive: true,
      parentId: customersGroup.id,
    });

    return customerLedger;
  }
}
