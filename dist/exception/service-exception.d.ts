import { HttpException, HttpStatus } from '@nestjs/common';
export declare class ServiceException extends HttpException {
    readonly headerMessage: string;
    readonly errors: string[];
    constructor(messageOrErrors: string | string[], headerMessage: string, status: HttpStatus);
}
