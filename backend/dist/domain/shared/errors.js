export class DomainError extends Error {
    code;
    details;
    constructor(code, message, details = {}) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = 'DomainError';
    }
}
//# sourceMappingURL=errors.js.map