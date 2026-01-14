import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "src/service/auth-service";
import { AuthRequestDto } from "../dto/auth-request.dto";
import { AuthResponseDto } from "../dto/auth.response.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(@Body() authRequestDto: AuthRequestDto): Promise<AuthResponseDto> {
        return this.authService.login(authRequestDto);
    }
}