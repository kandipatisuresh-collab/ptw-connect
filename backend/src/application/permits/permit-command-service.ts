import { ActorContext } from '../../domain/shared/types.js';
import { createPermit, Permit, PermitDraftInput, submitPermit } from '../../domain/permits/permit.js';
import { PermitRepository } from '../../infrastructure/database/permit-repository.js';

export class PermitCommandService {
  public constructor(private readonly repository: PermitRepository) {}

  create(input: PermitDraftInput, actor: ActorContext): Permit {
    const permit = createPermit(input, actor, this.repository.nextSequence());
    return this.repository.save(permit);
  }

  submit(id: string, actor: ActorContext): Permit {
    const current = this.repository.get(id);
    return this.repository.save(submitPermit(current, actor), current.version);
  }
}
