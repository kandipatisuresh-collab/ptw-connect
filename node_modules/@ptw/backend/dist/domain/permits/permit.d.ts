import { PermitScope } from '../authorization/authorization.js';
import { AuditRecord } from '../audit/audit-service.js';
import { ActorContext, PermitStatus, UUID, VersionedRecord } from '../shared/types.js';
export interface PermitDraftInput {
    permitTypeId: string;
    title: string;
    workDescription: string;
    plantId: string;
    areaId: string;
    plannedStart: string;
    plannedEnd: string;
    contractor?: string;
    workerCount?: number;
}
export interface Permit extends VersionedRecord {
    permitNumber: string;
    status: PermitStatus;
    requestedBy: UUID;
    scope: PermitScope;
    permitTypeId: string;
    title: string;
    workDescription: string;
    plannedStart: string;
    plannedEnd: string;
    contractor?: string;
    workerCount?: number;
    audit: readonly AuditRecord[];
}
export declare function createPermit(input: PermitDraftInput, actor: ActorContext, sequence: number): Permit;
export declare function submitPermit(permit: Permit, actor: ActorContext): Permit;
