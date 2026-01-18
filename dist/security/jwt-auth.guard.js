"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const token_service_1 = require("../service/token.service");
let JwtAuthGuard = class JwtAuthGuard {
    publicPrefix = '/api/v1/auth';
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const path = request.path;
        if (path.startsWith(this.publicPrefix)) {
            return true;
        }
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Authorization header missing or malformed');
        }
        const token = authHeader.split(' ')[1];
        const decoded = token_service_1.TokenService.decodeToken(token);
        if (!decoded) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
        request.user = decoded;
        return true;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map