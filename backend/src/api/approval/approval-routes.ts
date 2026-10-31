import { ApprovalService } from '../../application/approval/approval-service.js';
export function decideApproval(service: ApprovalService, id: string, actorId: string, roles: readonly string[], decision: 'APPROVE' | 'REJECT' | 'SEND_BACK', comments: string) { return service.decide(id, actorId, roles, decision, comments); }
