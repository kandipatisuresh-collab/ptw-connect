import { DomainError } from '../../domain/shared/errors.js';
export function requestExtension(permit, proposedEnd) { if (!['ACTIVE', 'SUSPENDED', 'RESUMED'].includes(permit.status))
    throw new DomainError('INVALID_TRANSITION', 'Only active work can request an extension.'); if (new Date(proposedEnd) <= new Date(permit.plannedEnd))
    throw new DomainError('VALIDATION_ERROR', 'Extension must move the planned end forward.'); return { ...permit, status: 'EXTENSION_REQUESTED', plannedEnd: proposedEnd, version: permit.version + 1, updatedAt: new Date().toISOString() }; }
//# sourceMappingURL=permit-extension-service.js.map