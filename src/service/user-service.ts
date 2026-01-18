import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { ResponseDto } from "src/api/dto/response.dto";
import { User } from "src/entity/user";
import { ServiceException } from "src/exception/service-exception";
import { Brackets, Repository } from "typeorm";
import { EmailService } from "./mail.service";
import { TokenService } from "./token.service";
import { UserDto } from "src/api/dto/user.dto";
import * as bcrypt from 'bcrypt';
import { PaginatedResponseDto } from "src/api/dto/paginated.response.dto";
import { UserResponseDto } from "src/api/dto/user.response.dto";
import { UpdateCredentialsDto } from "src/api/dto/user.credentials.dto";
import { CurrentUserDetailsDto } from "src/api/dto/current-user-details.dto";

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: EmailService,
    private readonly tokenService: TokenService
  ) { }

  async createUser(dto: UserDto, request: Request): Promise<ResponseDto> {
    await this.validateEmailUniqueness(dto.email, dto.id);

    const isNewUser = !dto.id;
    const user = await this.convert(dto);

    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new ServiceException('Authorization header missing', "Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    await this.userRepository.save(user);

    if (isNewUser) {
      const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);

      // Set token and expiration (1 year from now)
      user.resetToken = resetToken;
      user.resetTokenExpires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 365 days in ms
      user.isFirstLogin = true;
      await this.userRepository.save(user);

      // const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      // const resetLink = `${frontendUrl}/new-password?token=${resetToken}`;

      // await this.mailService.sendMail(
      //   dto.email,
      //   'Your Account Has Been Created',
      //   {
      //     EMAIL: dto.email,
      //     USER_NAME: dto.fullName,
      //     TEMP_PASSWORD: dto.password,
      //     RESET_LINK: resetLink,
      //   },
      //   'account-creation-template'
      // );
    }

    return new ResponseDto('USER_SAVED');
  }

  private async validateEmailUniqueness(email: string, userId?: number): Promise<void> {
    const query = this.userRepository.createQueryBuilder('user')
      .where('user.email = :email', { email });

    if (userId) {
      query.andWhere('user.id != :userId', { userId });
    }

    const existingUser = await query.getOne();

    if (existingUser) {
      throw new ServiceException('Email already exists', 'Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  private async convert(dto: UserDto): Promise<User> {
    if (dto.id) {
      const existing = await this.userRepository.findOneBy({ id: dto.id });
      if (!existing) {
        throw new ServiceException('User not found', 'Bad request', HttpStatus.BAD_REQUEST);
      }

      existing.fullName = dto.fullName;
      existing.phoneNo = dto.phoneNo;
      existing.isActive = dto.isActive ?? true;
      existing.profile = dto.profile;
      existing.roleId = dto.roleId ?? dto.roleId;
      existing.address = dto.address;
      return existing;
    }

    // For new users, hash password and include email
    const hashedPassword = await this.hashPassword(dto.password);

    return this.userRepository.create({
      ...dto,
      password: hashedPassword,
      isActive: dto.isActive ?? true,
      roleId: dto.roleId,
    });
  }


  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async getAllUsers(
    page: number,
    size: number,
    search: string,
    request: Request
  ): Promise<PaginatedResponseDto<UserResponseDto>> {

    // 1️⃣ Authorization check
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new ServiceException(
        'Authorization header missing',
        "Unauthorized",
        HttpStatus.UNAUTHORIZED
      );
    }
  
    // 2️⃣ Pagination setup
    const offset = (page - 1) * size;
    const likeSearch = search ? `%${search}%` : '%%';

    // 3️⃣ Base query condition for search
    const baseWhere = new Brackets((qb) => {
      qb.where('u.email LIKE :search')
        .orWhere('u.fullName LIKE :search');
    });

    // 4️⃣ Query with pagination
    const query = this.userRepository
      .createQueryBuilder('u')
      .select([
        'u.id AS id',
        'u.profile AS profile',
        'u.email AS email',
        'u.fullName AS fullName',
        'u.phoneNo AS phoneNo',
        'u.isActive AS isActive',
      ])
      .where(baseWhere)
      .skip(offset)
      .take(size)
      .setParameters({ search: likeSearch });

    // 5️⃣ Count total matching records
    const countQuery = this.userRepository
      .createQueryBuilder('u')
      .where(baseWhere)
      .setParameters({ search: likeSearch });

    const [rawResults, total] = await Promise.all([
      query.getRawMany(),
      countQuery.getCount(),
    ]);

    // 6️⃣ Map results to DTO
    const baseUrl = this.configService.get<string>('CLOUDINARY_BASE_URL');

    const data = rawResults.map(
      (row) =>
        new UserResponseDto(
          row.id,
          row.profile ? baseUrl + row.profile : null,
          row.email,
          row.fullName,
          row.phoneNo,
          row.isActive
        )
    );

    // 7️⃣ Prepare paginated response
    const totalPages = Math.ceil(total / size);

    const response = new PaginatedResponseDto<UserResponseDto>();
    response.data = data;
    response.currentPage = page;
    response.totalPages = totalPages;
    response.totalItems = total;
    response.hasNextPage = page < totalPages;
    response.hasPreviousPage = page > 1;

    return response;
  }


  async getUserById(userId: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new ServiceException('User not found', 'Bad request', HttpStatus.BAD_REQUEST);
    }

    const baseUrl = this.configService.get<string>('CLOUDINARY_BASE_URL');

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNo: user.phoneNo,
      profile: user.profile ? baseUrl + user.profile : '',

      address: user.address,
      password: "",
      roleId: user.roleId,
    };
  }

  async deleteUser(id: number): Promise<ResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new ServiceException('User not found', 'Bad request', HttpStatus.BAD_REQUEST);

    await this.userRepository.delete(user.id);
    return new ResponseDto("User deleted")
  }

  async updateUserStatus(id: string, status: boolean): Promise<ResponseDto> {
    const result = await this.userRepository.update(id, { isActive: status });

    if (result.affected === 0) {
      throw new ServiceException('User not found', 'Bad request', HttpStatus.BAD_REQUEST)
    }

    return new ResponseDto("User status updated successfully");
  }

  async updateUserCredentials(dto: UpdateCredentialsDto): Promise<ResponseDto> {
    const user = await this.userRepository.findOneBy({ id: dto.userId });
    if (!user) {
      throw new ServiceException('User not found', 'Bad request', HttpStatus.BAD_REQUEST);
    }

    await this.validateEmailUniqueness(dto.newEmail, dto.userId);

    user.email = dto.newEmail;
    user.password = await this.hashPassword(dto.newPassword);

    // Generate a reset token and expiry
    const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
    user.isFirstLogin = true;

    await this.userRepository.save(user);

    // Send credentials email
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const resetLink = `${frontendUrl}/new-password?token=${resetToken}`;

    await this.mailService.sendMail(
      user.email,
      'Your Credentials Have Been Updated',
      {
        USER_NAME: user.fullName,
        USER_EMAIL: user.email,
        TEMP_PASSWORD: dto.newPassword,
        RESET_LINK: resetLink,
      },
      'credentials-update-confirmation-template'
    );

    return new ResponseDto('CREDENTIALS_UPDATED_SUCCESSFULLY');
  }

  async getCurrentUserDetails(request: Request): Promise<CurrentUserDetailsDto> {
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new ServiceException('Authorization header missing', "Unauthprized", HttpStatus.BAD_REQUEST);
    }

    const token = authHeader.replace('Bearer ', '');
    const tokenInfo = TokenService.getTokenInfo(token);
    const adminId = tokenInfo.sub; // assuming sub holds adminId

    console.log('Extracted adminId:', adminId);

    if (!adminId) {
      throw new ServiceException('Invalid token - adminId not found', "Unauthprized", HttpStatus.BAD_REQUEST);
    }

    const result = await this.userRepository
      .createQueryBuilder('u')
      .leftJoin(User, 'child', 'child.adminId = u.id AND child.userType = :userType', { userType: 'ADMIN' })
      .select('u.fullName', 'fullName')
      .addSelect('u.logo', 'profile')
      .addSelect('u.userType', 'userType')
      .addSelect('COUNT(child.id)', 'totalCount')
      .addSelect('SUM(CASE WHEN child.isActive = true THEN 1 ELSE 0 END)', 'activeCount')
      .where('u.id = :adminId', { adminId })
      .getRawOne();


    console.log('Query result:', result);

    if (!result) {
      throw new ServiceException('No user found for the given adminId', 'Bad request', HttpStatus.BAD_REQUEST);
    }

    // Get base URL from config service
    const baseUrl = this.configService.get<string>('CLOUDINARY_BASE_URL');

    return {
      userName: result.fullName,
      profile: result.profile ? baseUrl + result.profile : null,
      totalCompanies: parseInt(result.totalCount, 10),
      activeCompanies: parseInt(result.activeCount, 10),
      userType: result.userType === 'SUPER_ADMIN' ? 'SUPER ADMIN' : result.userType,
    };
  }
}