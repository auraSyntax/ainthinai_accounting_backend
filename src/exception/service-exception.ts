import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiErrorDetail } from '../api/dto/response.dto';

export class ServiceException extends HttpException {
  public readonly headerMessage: string;
  public readonly errors: ApiErrorDetail[];

  constructor(
    messageOrErrors: string | string[] | ApiErrorDetail[],
    headerMessage: string,
    status: HttpStatus,
  ) {
    // Create combined message for HttpException's message parameter
    let combinedMessage: string;
    let structuredErrors: ApiErrorDetail[];

    if (Array.isArray(messageOrErrors)) {
      if (messageOrErrors.length > 0 && typeof messageOrErrors[0] === 'object') {
        // Array of ApiErrorDetail
        structuredErrors = messageOrErrors as ApiErrorDetail[];
        combinedMessage = structuredErrors.map(e => e.message).join('; ');
      } else {
        // Array of strings
        structuredErrors = (messageOrErrors as string[]).map(msg => ({ message: msg }));
        combinedMessage = messageOrErrors.join('; ');
      }
    } else {
      // Single string
      combinedMessage = messageOrErrors as string;
      structuredErrors = [{ message: messageOrErrors as string }];
    }

    super(combinedMessage, status);

    this.headerMessage = headerMessage;
    this.errors = structuredErrors;
  }
}
