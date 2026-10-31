import { ActorContext, PermitStatus, UUID } from '../shared/types.js';
export interface AuditRecord {
    id: UUID;
    entityId: UUID;
    action: string;
    actorId: UUID;
    role: string;
    previousStatus?: PermitStatus;
    newStatus?: PermitStatus;
    correlationId: string;
    occurredAt: string;
}
export interface AuditWriter {
    append(record: AuditRecord): void;
}
export declare function transitionAudit(entityId: UUID, actor: ActorContext, action: string, previousStatus: PermitStatus, newStatus: PermitStatus): AuditRecord;
