import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req } from "@nestjs/common";
import { UserService } from "src/service/user-service";
import { UserDto } from "../dto/user.dto";
import { ApiResponse } from "../dto/response.dto";
import { PaginatedResponseDto } from "../dto/paginated.response.dto";
import { UserResponseDto } from "../dto/user.response.dto";
import { ServiceException } from "src/exception/service-exception";
import { UpdateCredentialsDto } from "../dto/user.credentials.dto";
import { CurrentUserDetailsDto } from "../dto/current-user-details.dto";

@Controller('api/v1/users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async createUser(@Body() userDto: UserDto, @Req() request: Request) {
        const data = await this.userService.createUser(userDto, request);
        return ApiResponse.created(data, 'User created successfully');
    }

    @Get()
    async getAllUsers(@Query('page', ParseIntPipe) page: number, @Query('size', ParseIntPipe) size: number, @Query('search') search: string, @Req() request: Request) {
        const data = await this.userService.getAllUsers(page, size, search, request);
        return ApiResponse.success(
            data.data, 
            'Users fetched successfully',
            200,
            {
                page: data.currentPage,
                limit: Math.ceil(data.totalItems / data.data.length),
                total: data.totalItems
            }
        );
    }

    @Get('user-by-id')
    async getUserById(@Query('userId') userId: number) {
        if (!userId) {
            throw new ServiceException([{message: "userId can't be blank"}], "Bad Request", HttpStatus.BAD_REQUEST);
        }
        const data = await this.userService.getUserById(userId);
        return ApiResponse.success(data, 'User fetched successfully');
    }

    @Delete(':userId')
    async deleteUser(@Param('userId') userId: number) {
        if (!userId) {
            throw new ServiceException([{message: "userId can't be blank"}], "Bad Request", HttpStatus.BAD_REQUEST);
        }
        await this.userService.deleteUser(userId);
        return ApiResponse.success(null, 'User deleted successfully');
    }

    @Put()
    async updateUserStatus(@Query('id') id: string, @Query('status') status: string) {
        const parsedStatus = status === '1' ? true : false;
        await this.userService.updateUserStatus(id, parsedStatus);
        return ApiResponse.success(null, 'User status updated successfully');
    }

    @Put('user-credentials')
    async updateUserCredentials(@Body() dto: UpdateCredentialsDto) {
        await this.userService.updateUserCredentials(dto);
        return ApiResponse.success(null, 'User credentials updated successfully');
    }

    @Get('current-user')
    async getCurrentUserDetails(@Req() request: Request) {
        const data = await this.userService.getCurrentUserDetails(request);
        return ApiResponse.success(data, 'Current user details fetched successfully');
    }
}