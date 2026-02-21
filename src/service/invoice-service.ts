import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Invoice } from '../entity/invoice';
import { InvoiceLineItem } from '../entity/invoice-line-item';
import { CreateInvoiceDto, UpdateInvoiceDto, PostInvoiceDto } from '../api/dto/invoice.dto';
import { CustomerService } from './customer-service';
import { VendorService } from './vendor-service';
import { AccountService } from './account-service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceLineItem)
    private readonly invoiceLineItemRepository: Repository<InvoiceLineItem>,
    private readonly customerService: CustomerService,
    private readonly vendorService: VendorService,
    private readonly accountService: AccountService,
  ) {}

  async create(createDto: CreateInvoiceDto): Promise<Invoice> {
    // Validate invoice number is unique
    const existing = await this.invoiceRepository.findOne({
      where: { invoiceNumber: createDto.invoiceNumber },
    });

    if (existing) {
      throw new BadRequestException('Invoice number already exists');
    }

    // Validate customer if provided
    if (createDto.customerId) {
      await this.customerService.findById(createDto.customerId);
    }

    // Validate vendor if provided (for vendor-specific invoices)
    if (createDto.vendorId) {
      await this.vendorService.findById(createDto.vendorId);
    }

    // Calculate total amount from line items
    let totalAmount = 0;
    const lineItems = createDto.lineItems.map((item) => {
      const lineTotal = item.quantity * item.unitPrice;
      totalAmount += lineTotal;
      return {
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal,
      };
    });

    if (totalAmount === 0) {
      throw new BadRequestException('Invoice total amount must be greater than zero');
    }

    // Create invoice
    const invoice = this.invoiceRepository.create({
      invoiceNumber: createDto.invoiceNumber,
      invoiceDate: createDto.invoiceDate,
      customerId: createDto.customerId,
      projectId: createDto.projectId,
      vendorId: createDto.vendorId,
      incomeLedgerId: createDto.incomeLedgerId,
      totalAmount,
      narration: createDto.narration,
      status: 'Draft',
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    // Create line items
    const savedLineItems = await this.invoiceLineItemRepository.save(
      lineItems.map((item) => ({
        ...item,
        invoiceId: savedInvoice.id,
      })),
    );

    savedInvoice.lineItems = savedLineItems;
    return savedInvoice;
  }

  async findAll(): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      relations: ['customer', 'vendor', 'lineItems'],
      order: { invoiceDate: 'DESC' },
    });
  }

  async findById(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['customer', 'vendor', 'lineItems'],
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async findByCustomer(customerId: number): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: { customerId },
      relations: ['lineItems'],
      order: { invoiceDate: 'DESC' },
    });
  }

  async findByProject(projectId: number): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: { projectId },
      relations: ['customer', 'lineItems'],
      order: { invoiceDate: 'DESC' },
    });
  }

  async update(id: number, updateDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findById(id);

    // Cannot update posted invoices
    if (invoice.status === 'Posted') {
      throw new BadRequestException('Cannot update posted invoices');
    }

    // Validate customer if changed
    if (updateDto.customerId && updateDto.customerId !== invoice.customerId) {
      await this.customerService.findById(updateDto.customerId);
    }

    // Validate vendor if changed
    if (updateDto.vendorId && updateDto.vendorId !== invoice.vendorId) {
      await this.vendorService.findById(updateDto.vendorId);
    }

    // Update basic fields
    if (updateDto.invoiceNumber) invoice.invoiceNumber = updateDto.invoiceNumber;
    if (updateDto.invoiceDate) invoice.invoiceDate = updateDto.invoiceDate;
    if (updateDto.customerId !== undefined) invoice.customerId = updateDto.customerId;
    if (updateDto.projectId !== undefined) invoice.projectId = updateDto.projectId;
    if (updateDto.vendorId !== undefined) invoice.vendorId = updateDto.vendorId;
    if (updateDto.incomeLedgerId !== undefined) invoice.incomeLedgerId = updateDto.incomeLedgerId;
    if (updateDto.narration !== undefined) invoice.narration = updateDto.narration;

    // Update line items if provided
    if (updateDto.lineItems && updateDto.lineItems.length > 0) {
      // Delete existing line items
      await this.invoiceLineItemRepository.delete({ invoiceId: id });

      // Create new line items
      let totalAmount = 0;
      const newLineItems = updateDto.lineItems.map((item) => {
        const lineTotal = item.quantity * item.unitPrice;
        totalAmount += lineTotal;
        return {
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal,
          invoiceId: id,
        };
      });

      invoice.totalAmount = totalAmount;
      await this.invoiceLineItemRepository.save(newLineItems);
    }

    return await this.invoiceRepository.save(invoice);
  }

  async postInvoice(id: number, postDto?: PostInvoiceDto): Promise<Invoice> {
    const invoice = await this.findById(id);

    if (invoice.status === 'Posted') {
      throw new BadRequestException('Invoice is already posted');
    }

    if (invoice.status === 'Cancelled') {
      throw new BadRequestException('Cannot post a cancelled invoice');
    }

    // Validate customer exists
    if (!invoice.customerId) {
      throw new BadRequestException('Invoice must have a customer');
    }

    // Set income ledger if provided, otherwise use default
    if (postDto?.incomeLedgerId) {
      invoice.incomeLedgerId = postDto.incomeLedgerId;
    }

    if (!invoice.incomeLedgerId) {
      throw new BadRequestException('Income ledger must be specified');
    }

    // Validate income ledger exists and is not a group account
    const incomeLedger = await this.accountService.findById(invoice.incomeLedgerId);
    if (incomeLedger.isGroup) {
      throw new BadRequestException('Income ledger must be a posting account, not a group');
    }

    // TODO: Create journal entry
    // Dr Customer Ledger → Total Amount
    // Cr Income Ledger → Total Amount

    invoice.status = 'Posted';
    return await this.invoiceRepository.save(invoice);
  }

  async cancelInvoice(id: number): Promise<Invoice> {
    const invoice = await this.findById(id);

    if (invoice.status === 'Cancelled') {
      throw new BadRequestException('Invoice is already cancelled');
    }

    if (invoice.status === 'Posted') {
      throw new BadRequestException('Cannot cancel a posted invoice. Create a credit note instead.');
    }

    invoice.status = 'Cancelled';
    return await this.invoiceRepository.save(invoice);
  }

  async deleteInvoice(id: number): Promise<void> {
    const invoice = await this.findById(id);

    if (invoice.status === 'Posted') {
      throw new BadRequestException('Cannot delete posted invoices');
    }

    // Delete line items first (due to cascade, this might not be needed but being explicit)
    await this.invoiceLineItemRepository.delete({ invoiceId: id });

    // Delete invoice
    await this.invoiceRepository.delete(id);
  }

  async getInvoicesByStatus(status: string): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: { status },
      relations: ['customer', 'vendor', 'lineItems'],
      order: { invoiceDate: 'DESC' },
    });
  }
}
