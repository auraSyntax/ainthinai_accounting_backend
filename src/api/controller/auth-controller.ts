import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "src/service/auth-service";
import { AuthRequestDto } from "../dto/auth-request.dto";
import { AuthResponseDto } from "../dto/auth.response.dto";
import { RefreshTokenRequestDto } from "../dto/refresh.token.request.dto";

@Controller('api/v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(@Body() authRequestDto: AuthRequestDto): Promise<AuthResponseDto> {
        return this.authService.login(authRequestDto);
    }

    @Post('refresh-token')
    refreshToken(@Body() refreshTokenRequestDto: RefreshTokenRequestDto): Promise<AuthResponseDto> {
        return this.authService.refreshToken(refreshTokenRequestDto.refreshToken);
    }
}