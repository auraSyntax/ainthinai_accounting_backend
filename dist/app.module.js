"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const user_1 = require("./entity/user");
const auth_controller_1 = require("./api/controller/auth-controller");
const auth_service_1 = require("./service/auth-service");
const role_1 = require("./entity/role");
const user_controller_1 = require("./api/controller/user-controller");
const role_service_1 = require("./service/role-service");
const user_service_1 = require("./service/user-service");
const role_controller_1 = require("./api/controller/role-controller");
const mail_service_1 = require("./service/mail.service");
const token_service_1 = require("./service/token.service");
const account_1 = require("./entity/account");
const customer_1 = require("./entity/customer");
const vendor_1 = require("./entity/vendor");
const bank_1 = require("./entity/bank");
const payment_method_1 = require("./entity/payment-method");
const cheque_book_1 = require("./entity/cheque-book");
const cheque_1 = require("./entity/cheque");
const account_controller_1 = require("./api/controller/account-controller");
const customer_controller_1 = require("./api/controller/customer-controller");
const vendor_controller_1 = require("./api/controller/vendor-controller");
const bank_controller_1 = require("./api/controller/bank-controller");
const payment_method_controller_1 = require("./api/controller/payment-method-controller");
const cheque_book_controller_1 = require("./api/controller/cheque-book-controller");
const file_controller_1 = require("./api/controller/file-controller");
const account_service_1 = require("./service/account-service");
const customer_service_1 = require("./service/customer-service");
const vendor_service_1 = require("./service/vendor-service");
const bank_service_1 = require("./service/bank-service");
const payment_method_service_1 = require("./service/payment-method-service");
const cheque_book_service_1 = require("./service/cheque-book-service");
const file_service_1 = require("./service/file.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME'),
                    entities: [user_1.User, role_1.Role, account_1.Account, customer_1.Customer, vendor_1.Vendor, bank_1.Bank, payment_method_1.PaymentMethod, cheque_book_1.ChequeBook, cheque_1.Cheque],
                    synchronize: false,
                    logging: true,
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([user_1.User, role_1.Role, account_1.Account, customer_1.Customer, vendor_1.Vendor, bank_1.Bank, payment_method_1.PaymentMethod, cheque_book_1.ChequeBook, cheque_1.Cheque]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1d' },
                }),
            }),
        ],
        controllers: [auth_controller_1.AuthController, role_controller_1.RoleController, user_controller_1.UserController, account_controller_1.AccountController, customer_controller_1.CustomerController, vendor_controller_1.VendorController, bank_controller_1.BankController, payment_method_controller_1.PaymentMethodController, cheque_book_controller_1.ChequeBookController, file_controller_1.FileController],
        providers: [auth_service_1.AuthService, role_service_1.RoleService, user_service_1.UserService, mail_service_1.EmailService, token_service_1.TokenService, account_service_1.AccountService, customer_service_1.CustomerService, vendor_service_1.VendorService, bank_service_1.BankService, payment_method_service_1.PaymentMethodService, cheque_book_service_1.ChequeBookService, file_service_1.FileService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map