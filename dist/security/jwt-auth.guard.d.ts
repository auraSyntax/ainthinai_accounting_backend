import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class JwtAuthGuard implements CanActivate {
    private readonly publicPrefix;
    canActivate(context: ExecutionContext): boolean;
}
