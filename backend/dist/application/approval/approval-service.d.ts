import { Approval, ApprovalDecision } from '../../domain/approval/approval.js';
import { ApprovalRepository } from '../../infrastructure/database/approval-repository.js';
export declare class ApprovalService {
    private readonly repository;
    constructor(repository: ApprovalRepository);
    decide(id: string, actorId: string, roles: readonly string[], decision: ApprovalDecision, comments: string): Approval;
    list(permitId: string): readonly Approval[];
}
