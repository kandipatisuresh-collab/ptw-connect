import { ActorContext } from '../../domain/shared/types.js';
import { requireScope } from '../../domain/authorization/authorization.js';
import { Permit } from '../../domain/permits/permit.js';
import { PermitRepository } from '../../infrastructure/database/permit-repository.js';

export class PermitQueryService {
  public constructor(private readonly repository: PermitRepository) {}

  get(id: string, actor: ActorContext): Permit {
    const permit = this.repository.get(id);
    requireScope(actor, permit.scope);
    return permit;
  }

  list(actor: ActorContext): readonly Permit[] {
    return this.repository.list().filter((permit) => actor.plantIds.includes(permit.scope.plantId) && actor.areaIds.includes(permit.scope.areaId));
  }
}
