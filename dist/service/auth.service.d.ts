import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entity/user';
import { AuthRequestDto } from 'src/dto/auth-request.dto';
import { AuthResponseDto } from 'src/dto/auth.response.dto';
import { ResetPasswordDto } from 'src/dto/reset-password.dto';
import { EmailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly configService;
    private readonly userRepository;
    private readonly jwtService;
    private readonly emailService;
    constructor(configService: ConfigService, userRepository: Repository<User>, jwtService: JwtService, emailService: EmailService);
    login(authRequestDto: AuthRequestDto): Promise<AuthResponseDto>;
    refreshToken(refreshToken: string): Promise<AuthResponseDto>;
    handleForgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
