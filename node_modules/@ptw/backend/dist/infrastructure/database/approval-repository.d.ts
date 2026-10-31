import { Approval } from '../../domain/approval/approval.js';
export declare class ApprovalRepository {
    private readonly values;
    save(value: Approval): Approval;
    get(id: string): Approval | undefined;
    forPermit(permitId: string): readonly Approval[];
}
