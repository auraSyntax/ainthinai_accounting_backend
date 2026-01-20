import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from '../entity/bank';
import { CreateBankDto, UpdateBankDto } from '../api/dto/bank.dto';
import { AccountService } from './account-service';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,
    private readonly accountService: AccountService,
  ) {}

  async create(createDto: CreateBankDto): Promise<Bank> {
    // Create bank ledger account
    const bankLedger = await this.createBankLedger(createDto.bankName);

    const bank = this.bankRepository.create({
      bankName: createDto.bankName,
      accountNumber: createDto.accountNumber,
      branch: createDto.branch,
      openingBalance: createDto.openingBalance || 0,
      ledgerAccountId: bankLedger.id,
      status: createDto.status || 'Active',
    });

    const savedBank = await this.bankRepository.save(bank);

    // TODO: If opening balance is provided, create opening journal entry
    // This will be implemented when journal module is created

    return savedBank;
  }

  async findAll(): Promise<Bank[]> {
    return await this.bankRepository.find({
      relations: ['ledgerAccount'],
      order: { bankName: 'ASC' },
    });
  }

  async findById(id: number): Promise<Bank> {
    const bank = await this.bankRepository.findOne({
      where: { id },
      relations: ['ledgerAccount'],
    });

    if (!bank) {
      throw new NotFoundException('Bank not found');
    }

    return bank;
  }

  async update(id: number, updateDto: UpdateBankDto): Promise<Bank> {
    const bank = await this.findById(id);

    Object.assign(bank, updateDto);
    return await this.bankRepository.save(bank);
  }

  async disable(id: number): Promise<void> {
    const bank = await this.findById(id);
    bank.status = 'Inactive';
    await this.bankRepository.save(bank);
  }

  private async createBankLedger(bankName: string) {
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

    // Create bank ledger
    const bankCode = `BANK-${Date.now()}`;
    const bankLedger = await this.accountService.create({
      accountCode: bankCode,
      accountName: `Bank - ${bankName}`,
      accountType: 'Asset',
      normalBalance: 'Debit',
      isGroup: false,
      isSystem: false,
      isActive: true,
      parentId: currentAssets.id,
    });

    return bankLedger;
  }
}
