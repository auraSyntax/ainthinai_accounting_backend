import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class JwtAuthGuard implements CanActivate {
    private readonly openPaths;
    canActivate(context: ExecutionContext): boolean;
}
