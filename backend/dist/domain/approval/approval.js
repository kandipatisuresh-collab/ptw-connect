import { DomainError } from '../shared/errors.js';
export function decideApproval(approval, actorId, actorRoles, decision, comments) {
    if (!actorRoles.includes(approval.requiredRole))
        throw new DomainError('FORBIDDEN', 'Actor does not hold the required approval role.');
    if (!comments.trim())
        throw new DomainError('VALIDATION_ERROR', 'Approval comments are required.');
    if (approval.decision)
        throw new DomainError('CONFLICT', 'Approval has already been decided.');
    return { ...approval, approverId: actorId, decision, comments: comments.trim(), decidedAt: new Date().toISOString() };
}
//# sourceMappingURL=approval.js.map