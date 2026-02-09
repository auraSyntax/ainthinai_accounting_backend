import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiErrorDetail } from '../api/dto/response.dto';
export declare class ServiceException extends HttpException {
    readonly headerMessage: string;
    readonly errors: ApiErrorDetail[];
    constructor(messageOrErrors: string | string[] | ApiErrorDetail[], headerMessage: string, status: HttpStatus);
}
