import { requireScope } from '../../domain/authorization/authorization.js';
export class PermitQueryService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    get(id, actor) {
        const permit = this.repository.get(id);
        requireScope(actor, permit.scope);
        return permit;
    }
    list(actor) {
        return this.repository.list().filter((permit) => actor.plantIds.includes(permit.scope.plantId) && actor.areaIds.includes(permit.scope.areaId));
    }
}
//# sourceMappingURL=permit-query-service.js.map