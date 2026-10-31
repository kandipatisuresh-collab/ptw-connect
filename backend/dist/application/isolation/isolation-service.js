import { transitionIsolation } from '../../domain/isolation/isolation.js';
export class IsolationService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    transition(id, next) { const value = this.repository.get(id); if (!value)
        throw new Error('Isolation not found.'); return this.repository.save(transitionIsolation(value, next)); }
    list(permitId) { return this.repository.forPermit(permitId); }
}
//# sourceMappingURL=isolation-service.js.map