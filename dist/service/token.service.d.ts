interface DecodedToken {
    sub: string;
    email: string;
    userType: string;
    [key: string]: any;
}
export interface TokenInfoDto {
    sub: string | null;
    email: string | null;
    userType: string | null;
}
export declare class TokenService {
    static decodeToken(token: string): DecodedToken | null;
    static getTokenInfo(token: string): TokenInfoDto;
}
export {};
