import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthRequestDto } from "src/api/dto/auth-request.dto";
import { AuthResponseDto } from "src/api/dto/auth.response.dto";
import { User } from "src/entity/user";
import { ServiceException } from "src/exception/service-exception";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async login(authRequestDto: AuthRequestDto): Promise<AuthResponseDto> {
        const { email, password, rememberMe } = authRequestDto;

        const user = await this.userRepository.findOne({ where: { email } });

        if (!user || user.isActive == false) {
            throw new ServiceException('User not found!', 'Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        if (user.isFirstLogin) {
            throw new ServiceException('Reset your password to continue the login!', 'Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new ServiceException('Invalid credentials!', 'Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        const payload = {
            sub: user.id,
            email: user.email,
            roleId: user.roleId,
        };

        const jwtExpiry = rememberMe ? '30d' : '15m';
        const refreshExpiry = rememberMe ? '31d' : '7d';

        const jwtToken = await this.jwtService.signAsync(payload, {
            expiresIn: jwtExpiry,
        });

        // Add rememberMe to refresh token payload only if true
        const refreshPayload = rememberMe ? { ...payload, rememberMe: true } : payload;

        const refreshToken = await this.jwtService.signAsync(refreshPayload, {
            expiresIn: refreshExpiry,
        });

        const baseUrl = this.configService.get<string>('CLOUDINARY_BASE_URL');

        const response = new AuthResponseDto();
        response.jwtToken = jwtToken;
        response.refreshToken = refreshToken;
        response.expirationTime = jwtExpiry;
        response.userName = user.fullName;
        response.email = authRequestDto.email;
        response.roleId = user.roleId;
        response.profile = user.profile ? baseUrl + user.profile : null!;
        return response;
    }
}