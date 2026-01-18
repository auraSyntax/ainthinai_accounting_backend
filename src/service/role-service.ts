import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginatedResponseDto } from "src/api/dto/paginated.response.dto";
import { ResponseDto } from "src/api/dto/response.dto";
import { RoleDto } from "src/api/dto/role-dto";
import { Role } from "src/entity/role";
import { ServiceException } from "src/exception/service-exception";
import { Brackets, Repository } from "typeorm";

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) { }

    async createOrUpdateRole(roleDto: RoleDto): Promise<ResponseDto> {

        let role: Role | null;

        if (roleDto.id) {
            role = await this.roleRepository.findOne({
                where: { id: roleDto.id }
            });

            if (!role) {
                throw new ServiceException("Role not found", "BAD_REQUEST", HttpStatus.BAD_REQUEST);
            }

            role.roleName = roleDto.roleName;
            role.roleDescription = roleDto.roleDescription;
            role.status = true;

            await this.roleRepository.save(role);

            return new ResponseDto('Role updated successfully');
        }

        role = this.roleRepository.create({
            roleName: roleDto.roleName,
            roleDescription: roleDto.roleDescription
        });

        await this.roleRepository.save(role);

        return new ResponseDto('Role created successfully');
    }

    async getRoleById(id: number): Promise<RoleDto> {
        const role = await this.roleRepository.findOne({
            where: { id }
        });

        if (!role) {
            throw new ServiceException(
                "Role not found",
                "BAD_REQUEST",
                HttpStatus.BAD_REQUEST
            );
        }

        const roleDto = new RoleDto();
        roleDto.id = role.id;
        roleDto.roleName = role.roleName;
        roleDto.roleDescription = role.roleDescription;

        return roleDto;
    }

    async getAllRoles(
        page: number,
        size: number,
        search: string,
        request: Request,
    ): Promise<PaginatedResponseDto<RoleDto>> {

        const offset = (page - 1) * size;
        const likeSearch = search ? `%${search}%` : '%%';

        const baseWhere = new Brackets((qb) => {
            qb.where('r.roleName LIKE :search')
                .orWhere('r.roleDescription LIKE :search');
        });

        const query = this.roleRepository
            .createQueryBuilder('r')
            .select([
                'r.id AS id',
                'r.roleName AS roleName',
                'r.roleDescription AS roleDescription',
                'r.status AS status',
            ])
            .where(baseWhere)
            .setParameters({ search: likeSearch })
            .skip(offset)
            .take(size);

        const [rawResults, total] = await Promise.all([
            query.getRawMany(),

            this.roleRepository
                .createQueryBuilder('r')
                .where(baseWhere)
                .setParameters({ search: likeSearch })
                .getCount(),
        ]);

        const data = rawResults.map(
            (row) =>
                new RoleDto(
                    row.id,
                    row.roleName,
                    row.roleDescription,
                    row.status
                ),
        );

        const totalPages = Math.ceil(total / size);

        const response = new PaginatedResponseDto<RoleDto>();
        response.data = data;
        response.currentPage = page;
        response.totalPages = totalPages;
        response.totalItems = total;

        response.hasNextPage = page < totalPages;
        response.hasPreviousPage = page > 1;
        return response;
    }



    async deleteRole(id: number): Promise<ResponseDto> {
        const role = await this.roleRepository.findOne({ where: { id } });
        if (!role) throw new ServiceException('Role not found', 'Bad request', HttpStatus.BAD_REQUEST);

        await this.roleRepository.delete(role.id);
        return new ResponseDto("Role deleted")
    }

    async updateRoleStatus(id: number, status: boolean): Promise<ResponseDto> {
        const result = await this.roleRepository.update(id, { status: status });

        if (result.affected === 0) {
            throw new ServiceException('Role not found', 'Bad request', HttpStatus.BAD_REQUEST)
        }

        return new ResponseDto("Role status updated successfully");
    }
}