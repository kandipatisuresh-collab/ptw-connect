import { DomainError } from '../shared/errors.js';
const allowedTypes = new Set(['application/pdf', 'image/jpeg', 'image/png']);
export function validateAttachment(input) { if (!allowedTypes.has(input.contentType))
    throw new DomainError('VALIDATION_ERROR', 'Attachment type is not allowed.'); if (input.size > 25 * 1024 * 1024)
    throw new DomainError('VALIDATION_ERROR', 'Attachment exceeds the 25 MB limit.'); }
//# sourceMappingURL=attachment.js.map