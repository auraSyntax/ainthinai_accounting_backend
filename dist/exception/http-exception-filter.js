"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const service_exception_1 = require("./service-exception");
const response_dto_1 = require("../api/dto/response.dto");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errors = [];
        if (exception instanceof service_exception_1.ServiceException) {
            status = exception.getStatus();
            message = exception.headerMessage;
            errors = exception.errors;
        }
        else if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            if (Array.isArray(res.message)) {
                message = 'Validation failed';
                errors = res.message.map((msg) => {
                    if (typeof msg === 'object' && msg.property) {
                        return {
                            field: msg.property,
                            message: Object.values(msg.constraints || {}).join(', ') || msg.message
                        };
                    }
                    return { message: String(msg) };
                });
            }
            else {
                message = res.error || res.message || 'HTTP Exception';
                errors = [{ message: res.message || 'An error occurred' }];
            }
            if (status === common_1.HttpStatus.UNAUTHORIZED) {
                errors = [{ code: 'AUTH_401', message: res.message || 'Invalid or expired token' }];
            }
            else if (status === common_1.HttpStatus.FORBIDDEN) {
                errors = [{ code: 'FORBIDDEN', message: res.message || 'You do not have permission to perform this action' }];
            }
            else if (status === common_1.HttpStatus.NOT_FOUND) {
                errors = [{ code: 'NOT_FOUND', message: res.message || 'Resource not found' }];
            }
            else if (status === common_1.HttpStatus.CONFLICT) {
                errors = [{ code: 'DUPLICATE_ENTRY', message: res.message || 'Resource already exists' }];
            }
        }
        else if (exception instanceof multer_1.MulterError) {
            status = common_1.HttpStatus.BAD_REQUEST;
            message = 'File upload error';
            errors = [{ message: exception.message }];
        }
        else {
            status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal server error';
            errors = [{
                    code: 'SERVER_ERROR',
                    message: 'Something went wrong. Please try again later.'
                }];
        }
        const errorResponse = response_dto_1.ApiResponse.error(message, status, errors);
        response.status(status).json(errorResponse);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception-filter.js.map