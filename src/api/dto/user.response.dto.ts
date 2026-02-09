export class UserResponseDto {
  id: string;
  logo: string;
  companyEmail: string;
  contactPerson: string;
  contactPhone: string;
  status: boolean;
  roleId?: number;
  roleName?: string;

  constructor(
    id: string,
    logo: string,
    companyEmail: string,
    contactPerson: string,
    contactPhone: string,
    status: boolean,
    roleId?: number,
    roleName?: string
  ) {
    this.id = id;
    this.logo = logo;
    this.companyEmail = companyEmail;
    this.contactPerson = contactPerson;
    this.contactPhone = contactPhone;
    this.status = status;
    this.roleId = roleId;
    this.roleName = roleName;
  }
}
