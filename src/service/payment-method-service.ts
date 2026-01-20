import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from '../entity/payment-method';
import { CreatePaymentMethodDto, UpdatePaymentMethodDto } from '../api/dto/payment-method.dto';
import { AccountService } from './account-service';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    private readonly accountService: AccountService,
  ) {}

  async create(createDto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    // Validate that linked ledger exists and is a posting account
    const linkedLedger = await this.accountService.findById(createDto.linkedLedgerId);

    if (linkedLedger.isGroup) {
      throw new BadRequestException('Payment method cannot be linked to a group account');
    }

    const paymentMethod = this.paymentMethodRepository.create({
      methodName: createDto.methodName,
      linkedLedgerId: createDto.linkedLedgerId,
      isActive: createDto.isActive !== undefined ? createDto.isActive : true,
    });

    return await this.paymentMethodRepository.save(paymentMethod);
  }

  async findAll(): Promise<PaymentMethod[]> {
    return await this.paymentMethodRepository.find({
      relations: ['linkedLedger'],
      order: { methodName: 'ASC' },
    });
  }

  async findById(id: number): Promise<PaymentMethod> {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id },
      relations: ['linkedLedger'],
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    return paymentMethod;
  }

  async update(id: number, updateDto: UpdatePaymentMethodDto): Promise<PaymentMethod> {
    const paymentMethod = await this.findById(id);

    // Validate linked ledger if changed
    if (updateDto.linkedLedgerId && updateDto.linkedLedgerId !== paymentMethod.linkedLedgerId) {
      const linkedLedger = await this.accountService.findById(updateDto.linkedLedgerId);

      if (linkedLedger.isGroup) {
        throw new BadRequestException('Payment method cannot be linked to a group account');
      }
    }

    Object.assign(paymentMethod, updateDto);
    return await this.paymentMethodRepository.save(paymentMethod);
  }

  async disable(id: number): Promise<void> {
    const paymentMethod = await this.findById(id);
    paymentMethod.isActive = false;
    await this.paymentMethodRepository.save(paymentMethod);
  }

  async findActive(): Promise<PaymentMethod[]> {
    return await this.paymentMethodRepository.find({
      where: { isActive: true },
      relations: ['linkedLedger'],
      order: { methodName: 'ASC' },
    });
  }
}
