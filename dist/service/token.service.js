"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jwt_decode_1 = require("jwt-decode");
class TokenService {
    static decodeToken(token) {
        try {
            const decoded = (0, jwt_decode_1.jwtDecode)(token);
            return decoded;
        }
        catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    }
    static getTokenInfo(token) {
        const decoded = this.decodeToken(token);
        return {
            sub: decoded?.sub ?? null,
            email: decoded?.email ?? null,
            userType: decoded?.userType ?? null
        };
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map