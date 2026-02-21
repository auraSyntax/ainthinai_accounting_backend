import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entity/user';
import { AuthController } from './api/controller/auth-controller';
import { AuthService } from './service/auth-service';
import { Role } from './entity/role';
import { UserController } from './api/controller/user-controller';
import { RoleService } from './service/role-service';
import { UserService } from './service/user-service';
import { RoleController } from './api/controller/role-controller';
import { EmailService } from './service/mail.service';
import { TokenService } from './service/token.service';

// Master Data Entities
import { Account } from './entity/account';
import { Customer } from './entity/customer';
import { Vendor } from './entity/vendor';
import { Bank } from './entity/bank';
import { PaymentMethod } from './entity/payment-method';
import { ChequeBook } from './entity/cheque-book';
import { Cheque } from './entity/cheque';

// Master Data Controllers
import { AccountController } from './api/controller/account-controller';
import { CustomerController } from './api/controller/customer-controller';
import { VendorController } from './api/controller/vendor-controller';
import { BankController } from './api/controller/bank-controller';
import { PaymentMethodController } from './api/controller/payment-method-controller';
import { ChequeBookController } from './api/controller/cheque-book-controller';
import { FileController } from './api/controller/file-controller';


// Master Data Services
import { AccountService } from './service/account-service';
import { CustomerService } from './service/customer-service';
import { VendorService } from './service/vendor-service';
import { BankService } from './service/bank-service';
import { PaymentMethodService } from './service/payment-method-service';
import { ChequeBookService } from './service/cheque-book-service';
import { FileService } from './service/file.service';

// Invoice Entities
import { Invoice } from './entity/invoice';
import { InvoiceLineItem } from './entity/invoice-line-item';

// Invoice Controller
import { InvoiceController } from './api/controller/invoice-controller';

// Invoice Service
import { InvoiceService } from './service/invoice-service';


@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Role, Account, Customer, Vendor, Bank, PaymentMethod, ChequeBook, Cheque, Invoice, InvoiceLineItem],
        synchronize: false,
        logging: true,
      }),
    }),

    TypeOrmModule.forFeature([User, Role, Account, Customer, Vendor, Bank, PaymentMethod, ChequeBook, Cheque, Invoice, InvoiceLineItem]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController, RoleController, UserController, AccountController, CustomerController, VendorController, BankController, PaymentMethodController, ChequeBookController, FileController, InvoiceController],
  providers: [AuthService, RoleService, UserService, EmailService, TokenService, AccountService, CustomerService, VendorService, BankService, PaymentMethodService, ChequeBookService, FileService, InvoiceService],
})
export class AppModule {}
