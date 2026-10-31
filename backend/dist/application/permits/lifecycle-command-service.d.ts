import { Permit } from '../../domain/permits/permit.js';
import { ActorContext, PermitStatus } from '../../domain/shared/types.js';
import { PermitRepository } from '../../infrastructure/database/permit-repository.js';
export declare class LifecycleCommandService {
    private readonly repository;
    constructor(repository: PermitRepository);
    transition(id: string, target: PermitStatus, actor: ActorContext, reason?: string): Permit;
}
