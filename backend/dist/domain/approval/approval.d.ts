export type ApprovalDecision = 'APPROVE' | 'REJECT' | 'SEND_BACK';
export interface Approval {
    id: string;
    permitId: string;
    requiredRole: string;
    approverId?: string;
    decision?: ApprovalDecision;
    comments?: string;
    decidedAt?: string;
}
export declare function decideApproval(approval: Approval, actorId: string, actorRoles: readonly string[], decision: ApprovalDecision, comments: string): Approval;
