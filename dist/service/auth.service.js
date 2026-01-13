"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
const user_1 = require("src/entity/user");
const auth_response_dto_1 = require("src/dto/auth.response.dto");
const mail_service_1 = require("./mail.service");
const service_exception_1 = require("../exception/service-exception");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    configService;
    userRepository;
    jwtService;
    emailService;
    constructor(configService, userRepository, jwtService, emailService) {
        this.configService = configService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async login(authRequestDto) {
        const { email, password, rememberMe } = authRequestDto;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user || user.isActive == false) {
            throw new service_exception_1.ServiceException('User not found!', 'Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        if (user.isFirstLogin) {
            throw new service_exception_1.ServiceException('Reset your password to continue the login!', 'Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new service_exception_1.ServiceException('Invalid credentials!', 'Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        const payload = {
            sub: user.id,
            email: user.email,
            userType: user.userType,
        };
        const jwtExpiry = rememberMe ? '30d' : '15m';
        const refreshExpiry = rememberMe ? '31d' : '7d';
        const jwtToken = await this.jwtService.signAsync(payload, {
            expiresIn: jwtExpiry,
        });
        const refreshPayload = rememberMe ? { ...payload, rememberMe: true } : payload;
        const refreshToken = await this.jwtService.signAsync(refreshPayload, {
            expiresIn: refreshExpiry,
        });
        const baseUrl = this.configService.get('CLOUDINARY_BASE_URL');
        const response = new auth_response_dto_1.AuthResponseDto();
        response.jwtToken = jwtToken;
        response.refreshToken = refreshToken;
        response.expirationTime = jwtExpiry;
        response.userName = user.fullName;
        response.email = authRequestDto.email;
        response.userType = user.userType === 'SUPER_ADMIN' ? 'SUPER ADMIN' : user.userType;
        response.profile = user.logo ? baseUrl + user.logo : null;
        return response;
    }
    async refreshToken(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken);
            const rememberMe = payload.rememberMe === true;
            const newPayload = {
                sub: payload.sub,
                email: payload.email,
                userType: payload.userType,
            };
            const jwtExpiry = rememberMe ? '30d' : '15m';
            const refreshExpiry = rememberMe ? '31d' : '7d';
            const newJwtToken = await this.jwtService.signAsync(newPayload, {
                expiresIn: jwtExpiry,
            });
            const refreshPayload = rememberMe ? { ...newPayload, rememberMe: true } : newPayload;
            const newRefreshToken = await this.jwtService.signAsync(refreshPayload, {
                expiresIn: refreshExpiry,
            });
            const existing = await this.userRepository.findOneBy({ id: payload.sub });
            const baseUrl = this.configService.get('CLOUDINARY_BASE_URL');
            const response = new auth_response_dto_1.AuthResponseDto();
            response.jwtToken = newJwtToken;
            response.refreshToken = newRefreshToken;
            response.expirationTime = jwtExpiry;
            response.email = payload.email;
            response.userName = existing?.fullName ?? '';
            response.userType = existing
                ? (existing.userType === 'SUPER_ADMIN' ? 'SUPER ADMIN' : existing.userType)
                : '';
            response.profile = existing?.logo ? baseUrl + existing.logo : null;
            return response;
        }
        catch (err) {
            throw new service_exception_1.ServiceException('Invalid or expired refresh token!', 'Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async handleForgotPassword(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new service_exception_1.ServiceException('User not found with provided email!', 'Bad Request', common_1.HttpStatus.BAD_REQUEST);
        }
        const resetToken = (0, uuid_1.v4)();
        const expiresIn = 1 * 60 * 1000;
        user.resetToken = resetToken;
        user.resetTokenExpires = new Date(Date.now() + expiresIn);
        await this.userRepository.save(user);
        const frontendUrl = this.configService.get('FRONTEND_URL');
        const resetLink = `${frontendUrl}/new-password?token=${resetToken}`;
        const context = {
            USER_NAME: user.fullName,
            RESET_LINK: resetLink,
        };
        await this.emailService.sendMail(user.email, 'Reset Your Password', context, 'reset-password-template');
        return { message: 'Password reset email sent successfully!' };
    }
    async resetPassword(resetPasswordDto) {
        const { resetToken, newPassword } = resetPasswordDto;
        const user = await this.userRepository.findOne({ where: { resetToken } });
        if (!user) {
            throw new service_exception_1.ServiceException('Invalid reset token!', 'Bad Request', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!user.resetTokenExpires || user.resetTokenExpires < new Date()) {
            throw new service_exception_1.ServiceException('Reset token has expired!', 'Bad Request', common_1.HttpStatus.BAD_REQUEST);
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = "";
        user.isFirstLogin = false;
        await this.userRepository.save(user);
        return { message: 'Password successfully updated!' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_1.User)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        jwt_1.JwtService, typeof (_a = typeof mail_service_1.EmailService !== "undefined" && mail_service_1.EmailService) === "function" ? _a : Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map