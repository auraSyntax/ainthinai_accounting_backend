"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceException = void 0;
const common_1 = require("@nestjs/common");
class ServiceException extends common_1.HttpException {
    headerMessage;
    errors;
    constructor(messageOrErrors, headerMessage, status) {
        const combinedMessage = Array.isArray(messageOrErrors)
            ? messageOrErrors.join('; ')
            : messageOrErrors;
        super(combinedMessage, status);
        this.headerMessage = headerMessage;
        this.errors = Array.isArray(messageOrErrors)
            ? messageOrErrors
            : [messageOrErrors];
    }
}
exports.ServiceException = ServiceException;
//# sourceMappingURL=service-exception.js.map