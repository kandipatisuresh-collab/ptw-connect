import { DomainError } from '../../domain/shared/errors.js';
export function requireSafetyControls(repository, permitId) { try {
    repository.validateChecklist(permitId);
}
catch (error) {
    if (error instanceof DomainError)
        throw error;
    throw new DomainError('SAFETY_GATE_BLOCKED', 'Safety controls are incomplete.');
} }
//# sourceMappingURL=safety-prerequisites.js.map