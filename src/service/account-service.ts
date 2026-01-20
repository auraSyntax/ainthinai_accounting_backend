import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Account } from '../entity/account';
import { CreateAccountDto, UpdateAccountDto, AccountResponseDto } from '../api/dto/account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(createDto: CreateAccountDto): Promise<Account> {
    // Check if account code already exists
    const existing = await this.accountRepository.findOne({
      where: { accountCode: createDto.accountCode },
    });

    if (existing) {
      throw new BadRequestException('Account code already exists');
    }

    // Validate parent account if provided
    if (createDto.parentId) {
      const parent = await this.accountRepository.findOne({
        where: { id: createDto.parentId },
      });

      if (!parent) {
        throw new BadRequestException('Parent account not found');
      }
    }

    const account = this.accountRepository.create(createDto);
    return await this.accountRepository.save(account);
  }

  async findAll(): Promise<AccountResponseDto[]> {
    const accounts = await this.accountRepository.find({
      relations: ['children'],
      order: { accountCode: 'ASC' },
    });

    return this.buildTree(accounts);
  }

  async findById(id: number): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async update(id: number, updateDto: UpdateAccountDto): Promise<Account> {
    const account = await this.findById(id);

    // Prevent modification of system accounts
    if (account.isSystem) {
      throw new BadRequestException('System accounts cannot be modified');
    }

    // Check if new account code already exists
    if (updateDto.accountCode && updateDto.accountCode !== account.accountCode) {
      const existing = await this.accountRepository.findOne({
        where: { accountCode: updateDto.accountCode },
      });

      if (existing) {
        throw new BadRequestException('Account code already exists');
      }
    }

    // Validate parent account if changed
    if (updateDto.parentId && updateDto.parentId !== account.parentId) {
      const parent = await this.accountRepository.findOne({
        where: { id: updateDto.parentId },
      });

      if (!parent) {
        throw new BadRequestException('Parent account not found');
      }

      // Prevent circular reference
      if (updateDto.parentId === id) {
        throw new BadRequestException('Account cannot be its own parent');
      }
    }

    Object.assign(account, updateDto);
    return await this.accountRepository.save(account);
  }

  async disable(id: number): Promise<void> {
    const account = await this.findById(id);

    // Prevent deletion of system accounts
    if (account.isSystem) {
      throw new BadRequestException('System accounts cannot be deleted');
    }

    // Check if account has children
    if (account.children && account.children.length > 0) {
      throw new BadRequestException('Cannot delete account with child accounts');
    }

    account.isActive = false;
    await this.accountRepository.save(account);
  }

  async findPostingAccounts(): Promise<Account[]> {
    return await this.accountRepository.find({
      where: { isGroup: false, isActive: true },
      order: { accountCode: 'ASC' },
    });
  }

  private buildTree(accounts: Account[]): AccountResponseDto[] {
    const accountMap = new Map<number, AccountResponseDto>();
    const rootAccounts: AccountResponseDto[] = [];

    // Create a map of all accounts
    accounts.forEach((account) => {
      accountMap.set(account.id, {
        id: account.id,
        parentId: account.parentId,
        accountCode: account.accountCode,
        accountName: account.accountName,
        accountType: account.accountType,
        normalBalance: account.normalBalance,
        isGroup: account.isGroup,
        isSystem: account.isSystem,
        isActive: account.isActive,
        children: [],
      });
    });

    // Build the tree structure
    accountMap.forEach((account) => {
      if (account.parentId) {
        const parent = accountMap.get(account.parentId);
        if (parent && parent.children) {
          parent.children.push(account);
        }
      } else {
        rootAccounts.push(account);
      }
    });

    return rootAccounts;
  }

  async findByCode(accountCode: string): Promise<Account | null> {
    return await this.accountRepository.findOne({
      where: { accountCode },
    });
  }

  async findOrCreateSystemAccount(
    accountCode: string,
    accountName: string,
    accountType: string,
    normalBalance: string,
    parentId?: number,
  ): Promise<Account> {
    let account = await this.findByCode(accountCode);

    if (!account) {
      account = this.accountRepository.create({
        accountCode,
        accountName,
        accountType,
        normalBalance,
        isGroup: false,
        isSystem: true,
        isActive: true,
        parentId,
      });
      account = await this.accountRepository.save(account);
    }

    return account;
  }
}
