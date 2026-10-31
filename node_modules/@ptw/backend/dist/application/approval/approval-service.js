import { decideApproval } from '../../domain/approval/approval.js';
export class ApprovalService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    decide(id, actorId, roles, decision, comments) { const value = this.repository.get(id); if (!value)
        throw new Error('Approval not found.'); return this.repository.save(decideApproval(value, actorId, roles, decision, comments)); }
    list(permitId) { return this.repository.forPermit(permitId); }
}
//# sourceMappingURL=approval-service.js.map