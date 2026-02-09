"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceException = void 0;
const common_1 = require("@nestjs/common");
class ServiceException extends common_1.HttpException {
    headerMessage;
    errors;
    constructor(messageOrErrors, headerMessage, status) {
        let combinedMessage;
        let structuredErrors;
        if (Array.isArray(messageOrErrors)) {
            if (messageOrErrors.length > 0 && typeof messageOrErrors[0] === 'object') {
                structuredErrors = messageOrErrors;
                combinedMessage = structuredErrors.map(e => e.message).join('; ');
            }
            else {
                structuredErrors = messageOrErrors.map(msg => ({ message: msg }));
                combinedMessage = messageOrErrors.join('; ');
            }
        }
        else {
            combinedMessage = messageOrErrors;
            structuredErrors = [{ message: messageOrErrors }];
        }
        super(combinedMessage, status);
        this.headerMessage = headerMessage;
        this.errors = structuredErrors;
    }
}
exports.ServiceException = ServiceException;
//# sourceMappingURL=service-exception.js.map