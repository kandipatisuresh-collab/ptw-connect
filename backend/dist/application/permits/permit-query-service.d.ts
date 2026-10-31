import { ActorContext } from '../../domain/shared/types.js';
import { Permit } from '../../domain/permits/permit.js';
import { PermitRepository } from '../../infrastructure/database/permit-repository.js';
export declare class PermitQueryService {
    private readonly repository;
    constructor(repository: PermitRepository);
    get(id: string, actor: ActorContext): Permit;
    list(actor: ActorContext): readonly Permit[];
}
