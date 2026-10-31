import { DomainError } from '../shared/errors.js';
import { PermitStatus } from '../shared/types.js';

const transitions: Record<PermitStatus, readonly PermitStatus[]> = {
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

export function assertTransition(from: PermitStatus, to: PermitStatus): void {
  if (!transitions[from].includes(to)) {
    throw new DomainError('INVALID_TRANSITION', `Cannot transition permit from ${from} to ${to}.`, {
      from,
      to,
    });
  }
}

export function allowedTransitions(status: PermitStatus): readonly PermitStatus[] {
  return transitions[status];
}
