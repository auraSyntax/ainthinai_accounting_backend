import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChequeBook } from '../entity/cheque-book';
import { Cheque } from '../entity/cheque';
import { CreateChequeBookDto, UpdateChequeBookDto, UpdateChequeStatusDto } from '../api/dto/cheque-book.dto';
import { BankService } from './bank-service';

@Injectable()
export class ChequeBookService {
  constructor(
    @InjectRepository(ChequeBook)
    private readonly chequeBookRepository: Repository<ChequeBook>,
    @InjectRepository(Cheque)
    private readonly chequeRepository: Repository<Cheque>,
    private readonly bankService: BankService,
  ) {}

  async create(createDto: CreateChequeBookDto): Promise<ChequeBook> {
    // Validate bank exists
    await this.bankService.findById(createDto.bankId);

    // Validate cheque number range
    const startNo = parseInt(createDto.startNo);
    const endNo = parseInt(createDto.endNo);

    if (isNaN(startNo) || isNaN(endNo)) {
      throw new BadRequestException('Cheque numbers must be numeric');
    }

    if (startNo >= endNo) {
      throw new BadRequestException('Start number must be less than end number');
    }

    // Create cheque book
    const chequeBook = this.chequeBookRepository.create({
      bankId: createDto.bankId,
      startNo: createDto.startNo,
      endNo: createDto.endNo,
    });

    const savedChequeBook = await this.chequeBookRepository.save(chequeBook);

    // Generate individual cheques
    await this.generateCheques(savedChequeBook.id, createDto.bankId, startNo, endNo);

    return savedChequeBook;
  }

  async findAll(): Promise<ChequeBook[]> {
    return await this.chequeBookRepository.find({
      relations: ['bank'],
      order: { id: 'DESC' },
    });
  }

  async findById(id: number): Promise<ChequeBook> {
    const chequeBook = await this.chequeBookRepository.findOne({
      where: { id },
      relations: ['bank', 'cheques'],
    });

    if (!chequeBook) {
      throw new NotFoundException('Cheque book not found');
    }

    return chequeBook;
  }

  async update(id: number, updateDto: UpdateChequeBookDto): Promise<ChequeBook> {
    const chequeBook = await this.findById(id);

    // Validate bank if changed
    if (updateDto.bankId && updateDto.bankId !== chequeBook.bankId) {
      await this.bankService.findById(updateDto.bankId);
    }

    Object.assign(chequeBook, updateDto);
    return await this.chequeBookRepository.save(chequeBook);
  }

  async findChequesByBook(chequeBookId: number): Promise<Cheque[]> {
    return await this.chequeRepository.find({
      where: { chequeBookId },
      order: { chequeNo: 'ASC' },
    });
  }

  async findChequeByNumber(chequeNo: string): Promise<Cheque> {
    const cheque = await this.chequeRepository.findOne({
      where: { chequeNo },
      relations: ['bank'],
    });

    if (!cheque) {
      throw new NotFoundException('Cheque not found');
    }

    return cheque;
  }

  async updateChequeStatus(chequeNo: string, updateDto: UpdateChequeStatusDto): Promise<Cheque> {
    const cheque = await this.findChequeByNumber(chequeNo);

    // Prevent reusing a used or cancelled cheque
    if (cheque.status === 'Used' && updateDto.status === 'Available') {
      throw new BadRequestException('Cannot reactivate a used cheque');
    }

    cheque.status = updateDto.status;
    return await this.chequeRepository.save(cheque);
  }

  async findAvailableCheques(bankId: number): Promise<Cheque[]> {
    return await this.chequeRepository.find({
      where: { bankId, status: 'Available' },
      order: { chequeNo: 'ASC' },
    });
  }

  private async generateCheques(
    chequeBookId: number,
    bankId: number,
    startNo: number,
    endNo: number,
  ): Promise<void> {
    const cheques: Cheque[] = [];

    for (let i = startNo; i <= endNo; i++) {
      const chequeNo = i.toString().padStart(6, '0');

      // Check if cheque already exists
      const existing = await this.chequeRepository.findOne({
        where: { chequeNo },
      });

      if (existing) {
        throw new BadRequestException(`Cheque number ${chequeNo} already exists`);
      }

      const cheque = this.chequeRepository.create({
        chequeNo,
        bankId,
        chequeBookId,
        status: 'Available',
      });

      cheques.push(cheque);
    }

    await this.chequeRepository.save(cheques);
  }
}
