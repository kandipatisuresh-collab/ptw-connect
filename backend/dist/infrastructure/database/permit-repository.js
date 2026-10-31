import { DomainError } from '../../domain/shared/errors.js';
export class InMemoryPermitRepository {
    permits = new Map();
    sequence = 1;
    nextSequence() {
        return this.sequence++;
    }
    save(permit, expectedVersion) {
        const existing = this.permits.get(permit.id);
        if (existing && expectedVersion !== existing.version) {
            throw new DomainError('CONFLICT', 'Permit was changed by another user.', { expectedVersion, actualVersion: existing.version });
        }
        this.permits.set(permit.id, permit);
        return permit;
    }
    get(id) {
        const permit = this.permits.get(id);
        if (!permit)
            throw new DomainError('NOT_FOUND', 'Permit was not found.');
        return permit;
    }
    list() {
        return [...this.permits.values()];
    }
}
//# sourceMappingURL=permit-repository.js.map