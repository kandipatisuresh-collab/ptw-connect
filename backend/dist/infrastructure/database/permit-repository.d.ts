import { Permit } from '../../domain/permits/permit.js';
import { UUID } from '../../domain/shared/types.js';
export interface PermitRepository {
    nextSequence(): number;
    save(permit: Permit, expectedVersion?: number): Permit;
    get(id: UUID): Permit;
    list(): readonly Permit[];
}
export declare class InMemoryPermitRepository implements PermitRepository {
    private readonly permits;
    private sequence;
    nextSequence(): number;
    save(permit: Permit, expectedVersion?: number): Permit;
    get(id: UUID): Permit;
    list(): readonly Permit[];
}
