import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "src/service/auth-service";
import { AuthRequestDto } from "../dto/auth-request.dto";
import { AuthResponseDto } from "../dto/auth.response.dto";
import { RefreshTokenRequestDto } from "../dto/refresh.token.request.dto";
import { ApiResponse } from '../dto/response.dto';

@Controller('api/v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() authRequestDto: AuthRequestDto) {
        const data = await this.authService.login(authRequestDto);
        return ApiResponse.success(data, 'Login successful');
    }

    @Post('refresh-token')
    async refreshToken(@Body() refreshTokenRequestDto: RefreshTokenRequestDto) {
        const data = await this.authService.refreshToken(refreshTokenRequestDto.refreshToken);
        return ApiResponse.success(data, 'Token refreshed successfully');
    }
}