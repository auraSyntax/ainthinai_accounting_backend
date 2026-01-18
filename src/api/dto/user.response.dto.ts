export class UserResponseDto {
  id: string;
  logo: string;
  companyName : string
  companyEmail: string;
  contactPerson: string;
  contactPhone: string;
  status: boolean;

  constructor(id: string, logo: string, companyEmail: string,contactPerson:string,contactPhone:string, status: boolean) {
    this.id = id;
    this.logo = logo;
    this.companyEmail = companyEmail;
    this.contactPerson = contactPerson;
    this.contactPhone = contactPhone;
    this.status = status;
  }
}