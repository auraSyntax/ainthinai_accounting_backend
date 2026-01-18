// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { JwtModule } from '@nestjs/jwt';
// import { User } from './entity/user';
// import { AuthController } from './api/controller/auth-controller';
// import { AuthService } from './service/auth-service';


// @Module({
//   imports: [
//     ConfigModule.forRoot({ 
//       isGlobal: true,
//       envFilePath: '.env',
//     }),

//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => ({
//         type: 'mysql',
//         host: configService.get<string>('DB_HOST'),
//         port: configService.get<number>('DB_PORT'),
//         username: configService.get<string>('DB_USERNAME'),
//         password: configService.get<string>('DB_PASSWORD'),
//         database: configService.get<string>('DB_NAME'),
//         entities: [User],
//         synchronize: false,
//         logging: true,
//       }),
//     }),

//     TypeOrmModule.forFeature([User]),

//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => ({
//         secret: configService.get<string>('JWT_SECRET'),
//         signOptions: { expiresIn: '1d' },
//       }),
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService],
// })
// export class AppModule {}


import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

import { User } from './entity/user';
import { AuthController } from './api/controller/auth-controller';
import { AuthService } from './service/auth-service';
import { JwtAuthGuard } from './security/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQLHOST'),
        port: Number(configService.get<string>('MYSQLPORT')),
        username: configService.get<string>('MYSQLUSER'),
        password: configService.get<string>('MYSQLPASSWORD'),
        database: configService.get<string>('MYSQLDATABASE'),
        entities: [User],
        synchronize: false,
        logging: process.env.NODE_ENV !== 'production',
      }),
    }),

    TypeOrmModule.forFeature([User]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,

    // ✅ Proper global JWT guard (DI-safe)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

