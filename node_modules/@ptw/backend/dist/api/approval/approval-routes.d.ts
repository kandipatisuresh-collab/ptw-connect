import { ApprovalService } from '../../application/approval/approval-service.js';
export declare function decideApproval(service: ApprovalService, id: string, actorId: string, roles: readonly string[], decision: 'APPROVE' | 'REJECT' | 'SEND_BACK', comments: string): import("../../domain/approval/approval.js").Approval;
