"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseDto = exports.ApiResponse = void 0;
class ApiResponse {
    success;
    statusCode;
    message;
    data;
    errors;
    meta;
    timestamp;
    requestId;
    constructor(success, statusCode, message, data = null, errors = null, meta = null, requestId) {
        this.success = success;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.errors = errors;
        this.meta = meta;
        this.timestamp = new Date().toISOString();
        this.requestId = requestId || this.generateRequestId();
    }
    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
    static success(data, message, statusCode = 200, meta = null) {
        return new ApiResponse(true, statusCode, message, data, null, meta);
    }
    static created(data, message) {
        return new ApiResponse(true, 201, message, data, null, null);
    }
    static error(message, statusCode, errors, requestId) {
        return new ApiResponse(false, statusCode, message, null, errors, null, requestId);
    }
}
exports.ApiResponse = ApiResponse;
class ResponseDto {
    id;
    message;
    constructor(message) {
        this.message = message;
    }
}
exports.ResponseDto = ResponseDto;
//# sourceMappingURL=response.dto.js.map