import { AuditRecord, AuditWriter } from '../../domain/audit/audit-service.js';
export declare class InMemoryAuditRepository implements AuditWriter {
    private readonly records;
    append(record: AuditRecord): void;
    list(): readonly AuditRecord[];
}
