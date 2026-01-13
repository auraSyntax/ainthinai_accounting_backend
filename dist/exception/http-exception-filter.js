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
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let apiError;
        if (exception instanceof service_exception_1.ServiceException) {
            status = exception.getStatus();
            apiError = {
                status,
                message: exception.headerMessage,
                errors: exception.errors,
            };
        }
        else if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            const errors = Array.isArray(res.message) ? res.message : [res.message];
            apiError = {
                status,
                message: res.error || 'HTTP Exception',
                errors,
            };
        }
        else if (exception instanceof multer_1.MulterError) {
            status = common_1.HttpStatus.BAD_REQUEST;
            apiError = {
                status,
                message: 'File Upload Error',
                errors: [exception.message],
            };
        }
        else {
            apiError = {
                status,
                message: 'Internal Server Error',
                errors: ['Internal Service Exception'],
            };
        }
        response.status(status).json(apiError);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception-filter.js.map