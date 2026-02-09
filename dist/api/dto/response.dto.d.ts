export interface ApiErrorDetail {
    field?: string;
    code?: string;
    message: string;
}
export interface ApiMeta {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
}
export declare class ApiResponse<T = any> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T | null;
    errors: ApiErrorDetail[] | null;
    meta: ApiMeta | null;
    timestamp: string;
    requestId: string;
    constructor(success: boolean, statusCode: number, message: string, data?: T | null, errors?: ApiErrorDetail[] | null, meta?: ApiMeta | null, requestId?: string);
    private generateRequestId;
    static success<T>(data: T, message: string, statusCode?: number, meta?: ApiMeta | null): ApiResponse<T>;
    static created<T>(data: T, message: string): ApiResponse<T>;
    static error(message: string, statusCode: number, errors: ApiErrorDetail[], requestId?: string): ApiResponse<null>;
}
export declare class ResponseDto {
    id: number;
    message: string;
    constructor(message: string);
}
