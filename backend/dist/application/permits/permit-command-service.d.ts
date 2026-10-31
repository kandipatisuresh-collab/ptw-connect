import { ActorContext } from '../../domain/shared/types.js';
import { Permit, PermitDraftInput } from '../../domain/permits/permit.js';
import { PermitRepository } from '../../infrastructure/database/permit-repository.js';
export declare class PermitCommandService {
    private readonly repository;
    constructor(repository: PermitRepository);
    create(input: PermitDraftInput, actor: ActorContext): Permit;
    submit(id: string, actor: ActorContext): Permit;
}
