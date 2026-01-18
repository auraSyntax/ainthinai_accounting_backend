import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../service/token.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  // all auth APIs are public
  private readonly publicPrefix = '/api/v1/auth';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const path = request.path;

    // ✅ allow login & refresh-token without JWT
    if (path.startsWith(this.publicPrefix)) {
      return true;
    }

    // 🔐 everything else requires token
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    const decoded = TokenService.decodeToken(token);

    if (!decoded) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    (request as any).user = decoded;
    return true;
  }
}
