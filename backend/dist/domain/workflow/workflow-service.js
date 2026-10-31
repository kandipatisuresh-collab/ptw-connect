import { DomainError } from '../shared/errors.js';
const transitions = {
    DRAFT: ['SUBMITTED', 'CANCELLED'],
    SUBMITTED: ['UNDER_REVIEW', 'CANCELLED'],
    UNDER_REVIEW: ['SAFETY_REVIEW', 'CANCELLED'],
    SAFETY_REVIEW: ['ISOLATION_PENDING', 'APPROVAL_PENDING', 'CANCELLED'],
    ISOLATION_PENDING: ['APPROVAL_PENDING', 'CANCELLED'],
    APPROVAL_PENDING: ['APPROVED', 'CANCELLED'],
    APPROVED: ['ISSUED', 'CANCELLED'],
    ISSUED: ['ACTIVE', 'EXPIRED'],
    ACTIVE: ['SUSPENDED', 'CLOSURE_PENDING', 'EXPIRED'],
    SUSPENDED: ['RESUMED', 'EXPIRED', 'CANCELLED'],
    RESUMED: ['SUSPENDED', 'CLOSURE_PENDING', 'EXPIRED'],
    EXTENSION_REQUESTED: ['ACTIVE', 'APPROVED', 'CANCELLED'],
    EXPIRED: ['CLOSURE_PENDING'],
    CLOSURE_PENDING: ['CLOSED'],
    CLOSED: [],
    CANCELLED: [],
};
export function assertTransition(from, to) {
    if (!transitions[from].includes(to)) {
        throw new DomainError('INVALID_TRANSITION', `Cannot transition permit from ${from} to ${to}.`, {
            from,
            to,
        });
    }
}
export function allowedTransitions(status) {
    return transitions[status];
}
//# sourceMappingURL=workflow-service.js.map