// src/user/dto/user-save.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  phoneNo: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  roleId?: number;

  @IsOptional()
  profile: string;

  @IsOptional()
  address: string;
}
