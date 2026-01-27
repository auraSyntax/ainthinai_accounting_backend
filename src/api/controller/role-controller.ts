import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req } from "@nestjs/common";
import { RoleService } from "src/service/role-service";
import { RoleDto } from "../dto/role-dto";
import { ApiResponse } from "../dto/response.dto";
import { PaginatedResponseDto } from "../dto/paginated.response.dto";
import { ServiceException } from "src/exception/service-exception";

@Controller('api/v1/roles')
export class RoleController {

    private readonly roleService: RoleService;
    constructor(roleService: RoleService) {
        this.roleService = roleService;
    }

    @Post()
    async createRole(@Body() roleDto: RoleDto) {
        const data = await this.roleService.createOrUpdateRole(roleDto);
        return ApiResponse.created(data, 'Role created successfully');
    }

    @Get()
    async getAllRoles(@Query('page', ParseIntPipe) page: number, @Query('size', ParseIntPipe) size: number, @Query('search') search: string, @Req() request: Request) {
        const data = await this.roleService.getAllRoles(page, size, search, request);
        return ApiResponse.success(
            data.data, 
            'Roles fetched successfully',
            200,
            {
                page: data.currentPage,
                limit: Math.ceil(data.totalItems / data.data.length),
                total: data.totalItems
            }
        );
    }

    @Get('role-by-id')
    async getRoleById(@Query('roleId') roleId: number) {
        if (!roleId) {
            throw new ServiceException([{message: "roleId can't be blank"}], "Bad Request", HttpStatus.BAD_REQUEST);
        }
        const data = await this.roleService.getRoleById(roleId);
        return ApiResponse.success(data, 'Role fetched successfully');
    }

    @Delete(':roleId')
    async deleteRole(@Param('roleId') roleId: number) {
        if (!roleId) {
            throw new ServiceException([{message: "roleId can't be blank"}], "Bad Request", HttpStatus.BAD_REQUEST);
        }
        await this.roleService.deleteRole(roleId);
        return ApiResponse.success(null, 'Role deleted successfully');
    }

    @Put()
    async updateUserStatus(@Query('id') id: number, @Query('status') status: string) {
        const parsedStatus = status === '1' ? true : false;
        await this.roleService.updateRoleStatus(id, parsedStatus);
        return ApiResponse.success(null, 'Role status updated successfully');
    }
}