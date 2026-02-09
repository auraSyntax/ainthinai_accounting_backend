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

export class ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: ApiErrorDetail[] | null;
  meta: ApiMeta | null;
  timestamp: string;
  requestId: string;

  constructor(
    success: boolean,
    statusCode: number,
    message: string,
    data: T | null = null,
    errors: ApiErrorDetail[] | null = null,
    meta: ApiMeta | null = null,
    requestId?: string
  ) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.meta = meta;
    this.timestamp = new Date().toISOString();
    this.requestId = requestId || this.generateRequestId();
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  static success<T>(
    data: T,
    message: string,
    statusCode: number = 200,
    meta: ApiMeta | null = null
  ): ApiResponse<T> {
    return new ApiResponse(true, statusCode, message, data, null, meta);
  }

  static created<T>(data: T, message: string): ApiResponse<T> {
    return new ApiResponse(true, 201, message, data, null, null);
  }

  static error(
    message: string,
    statusCode: number,
    errors: ApiErrorDetail[],
    requestId?: string
  ): ApiResponse<null> {
    return new ApiResponse(false, statusCode, message, null, errors, null, requestId);
  }
}

// Legacy support
export class ResponseDto {
  id: number;
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}