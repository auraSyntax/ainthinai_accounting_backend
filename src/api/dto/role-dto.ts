
export class RoleDto {
    id?: number
    roleName?: string;
    roleDescription?: string;
    status?: boolean;

    constructor(id?: number, roleName?: string, roleDescription?: string, status?: boolean) {
        this.id = id;
        this.roleName = roleName;
        this.roleDescription = roleDescription;
        this.status = status;
    }
}