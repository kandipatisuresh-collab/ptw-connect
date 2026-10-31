import { Permit } from '../../domain/permits/permit.js';
import { DomainError } from '../../domain/shared/errors.js';
import { UUID } from '../../domain/shared/types.js';

export interface PermitRepository {
  nextSequence(): number;
  save(permit: Permit, expectedVersion?: number): Permit;
  get(id: UUID): Permit;
  list(): readonly Permit[];
}

export class InMemoryPermitRepository implements PermitRepository {
  private readonly permits = new Map<UUID, Permit>();
  private sequence = 1;

  nextSequence(): number {
    return this.sequence++;
  }

  save(permit: Permit, expectedVersion?: number): Permit {
    const existing = this.permits.get(permit.id);
    if (existing && expectedVersion !== existing.version) {
      throw new DomainError('CONFLICT', 'Permit was changed by another user.', { expectedVersion, actualVersion: existing.version });
    }
    this.permits.set(permit.id, permit);
    return permit;
  }

  get(id: UUID): Permit {
    const permit = this.permits.get(id);
    if (!permit) throw new DomainError('NOT_FOUND', 'Permit was not found.');
    return permit;
  }

  list(): readonly Permit[] {
    return [...this.permits.values()];
  }
}
