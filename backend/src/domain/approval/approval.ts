import { DomainError } from '../shared/errors.js';

export type ApprovalDecision = 'APPROVE' | 'REJECT' | 'SEND_BACK';
export interface Approval { id: string; permitId: string; requiredRole: string; approverId?: string; decision?: ApprovalDecision; comments?: string; decidedAt?: string; }

export function decideApproval(approval: Approval, actorId: string, actorRoles: readonly string[], decision: ApprovalDecision, comments: string): Approval {
  if (!actorRoles.includes(approval.requiredRole)) throw new DomainError('FORBIDDEN', 'Actor does not hold the required approval role.');
  if (!comments.trim()) throw new DomainError('VALIDATION_ERROR', 'Approval comments are required.');
  if (approval.decision) throw new DomainError('CONFLICT', 'Approval has already been decided.');
  return { ...approval, approverId: actorId, decision, comments: comments.trim(), decidedAt: new Date().toISOString() };
}
