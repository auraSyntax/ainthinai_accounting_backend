import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';
import { MulterError } from 'multer';
import { ServiceException } from './service-exception';
import { ApiResponse, ApiErrorDetail } from '../api/dto/response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: ApiErrorDetail[] = [];

    if (exception instanceof ServiceException) {
      status = exception.getStatus();
      message = exception.headerMessage;
      errors = exception.errors;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();
      
      // Handle validation errors from class-validator
      if (Array.isArray(res.message)) {
        message = 'Validation failed';
        errors = res.message.map((msg: any) => {
          if (typeof msg === 'object' && msg.property) {
            return {
              field: msg.property,
              message: Object.values(msg.constraints || {}).join(', ') || msg.message
            };
          }
          return { message: String(msg) };
        });
      } else {
        message = res.error || res.message || 'HTTP Exception';
        errors = [{ message: res.message || 'An error occurred' }];
      }

      // Set appropriate error codes based on status
      if (status === HttpStatus.UNAUTHORIZED) {
        errors = [{ code: 'AUTH_401', message: res.message || 'Invalid or expired token' }];
      } else if (status === HttpStatus.FORBIDDEN) {
        errors = [{ code: 'FORBIDDEN', message: res.message || 'You do not have permission to perform this action' }];
      } else if (status === HttpStatus.NOT_FOUND) {
        errors = [{ code: 'NOT_FOUND', message: res.message || 'Resource not found' }];
      } else if (status === HttpStatus.CONFLICT) {
        errors = [{ code: 'DUPLICATE_ENTRY', message: res.message || 'Resource already exists' }];
      }
    } else if (exception instanceof MulterError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'File upload error';
      errors = [{ message: exception.message }];
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      errors = [{ 
        code: 'SERVER_ERROR', 
        message: 'Something went wrong. Please try again later.' 
      }];
    }

    const errorResponse = ApiResponse.error(message, status, errors);
    response.status(status).json(errorResponse);
  }
}
