import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req } from "@nestjs/common";
import { RoleService } from "src/service/role-service";
import { RoleDto } from "../dto/role-dto";
import { ResponseDto } from "../dto/response.dto";
import { PaginatedResponseDto } from "../dto/paginated.response.dto";
import { ServiceException } from "src/exception/service-exception";

@Controller('api/v1/roles')
export class RoleController {

    private readonly roleService: RoleService;
    constructor(roleService: RoleService) {
        this.roleService = roleService;
    }

    @Post()
    async createRole(@Body() roleDto: RoleDto): Promise<ResponseDto> {
        return await this.roleService.createOrUpdateRole(roleDto);
    }

    @Get()
    async getAllRoles(@Query('page', ParseIntPipe) page: number, @Query('size', ParseIntPipe) size: number, @Query('search') search: string, @Req() request: Request): Promise<PaginatedResponseDto<RoleDto>> {
        return this.roleService.getAllRoles(page, size, search, request);
    }

    @Get('role-by-id')
    async getRoleById(@Query('roleId') roleId: number): Promise<RoleDto> {
        if (!roleId) {
            throw new ServiceException("roleId can't be blank", "Bad Request", HttpStatus.BAD_REQUEST);
        }
        return this.roleService.getRoleById(roleId);
    }

    @Delete(':roleId')
    async deleteRole(@Param('roleId') roleId: number): Promise<ResponseDto> {
        if (!roleId) {
            throw new ServiceException("roleId can't be blank", "Bad Request", HttpStatus.BAD_REQUEST);
        }
        return this.roleService.deleteRole(roleId);
    }

    @Put()
    async updateUserStatus(@Query('id') id: number, @Query('status') status: string): Promise<ResponseDto> {
        const parsedStatus = status === '1' ? true : false;

        return this.roleService.updateRoleStatus(id, parsedStatus);
    }
}