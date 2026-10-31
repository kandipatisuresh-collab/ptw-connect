import { createPermit, submitPermit } from '../../domain/permits/permit.js';
export class PermitCommandService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    create(input, actor) {
        const permit = createPermit(input, actor, this.repository.nextSequence());
        return this.repository.save(permit);
    }
    submit(id, actor) {
        const current = this.repository.get(id);
        return this.repository.save(submitPermit(current, actor), current.version);
    }
}
//# sourceMappingURL=permit-command-service.js.map