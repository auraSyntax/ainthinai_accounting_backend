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
        entities: [User,Role],
        synchronize: false,
        logging: true,
      }),
    }),

    TypeOrmModule.forFeature([User,Role]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController,RoleController,UserController],
  providers: [AuthService,RoleService,UserService,EmailService,TokenService],
})
export class AppModule {}
