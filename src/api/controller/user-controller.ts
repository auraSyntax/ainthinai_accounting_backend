import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req } from "@nestjs/common";
import { UserService } from "src/service/user-service";
import { UserDto } from "../dto/user.dto";
import { ResponseDto } from "../dto/response.dto";
import { PaginatedResponseDto } from "../dto/paginated.response.dto";
import { UserResponseDto } from "../dto/user.response.dto";
import { ServiceException } from "src/exception/service-exception";
import { UpdateCredentialsDto } from "../dto/user.credentials.dto";
import { CurrentUserDetailsDto } from "../dto/current-user-details.dto";

@Controller('api/v1/users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async createUser(@Body() userDto: UserDto, @Req() request: Request): Promise<ResponseDto> {
        return this.userService.createUser(userDto, request);
    }

    @Get()
    async getAllUsers(@Query('page', ParseIntPipe) page: number, @Query('size', ParseIntPipe) size: number, @Query('search') search: string, @Req() request: Request): Promise<PaginatedResponseDto<UserResponseDto>> {
        return this.userService.getAllUsers(page, size, search, request);
    }

    @Get('user-by-id')
    async getUserById(@Query('userId') userId: number): Promise<UserDto> {
        if (!userId) {
            throw new ServiceException("userId can't be blank", "Bad Request", HttpStatus.BAD_REQUEST);
        }
        return this.userService.getUserById(userId);
    }

    @Delete(':userId')
    async deleteUser(@Param('userId') userId: number): Promise<ResponseDto> {
        if (!userId) {
            throw new ServiceException("userId can't be blank", "Bad Request", HttpStatus.BAD_REQUEST);
        }
        return this.userService.deleteUser(userId);
    }

    @Put()
    async updateUserStatus(@Query('id') id: string, @Query('status') status: string): Promise<ResponseDto> {
        const parsedStatus = status === '1' ? true : false;

        return this.userService.updateUserStatus(id, parsedStatus);
    }

    @Put('user-credentials')
    async updateUserCredentials(@Body() dto: UpdateCredentialsDto): Promise<ResponseDto> {
        return this.userService.updateUserCredentials(dto);
    }

    @Get('current-user')
    async getCurrentUserDetails(@Req() request: Request): Promise<CurrentUserDetailsDto> {
        return this.userService.getCurrentUserDetails(request);
    }
}