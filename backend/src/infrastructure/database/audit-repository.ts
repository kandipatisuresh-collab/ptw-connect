import { AuditRecord, AuditWriter } from '../../domain/audit/audit-service.js';

export class InMemoryAuditRepository implements AuditWriter {
  private readonly records: AuditRecord[] = [];
  append(record: AuditRecord): void { this.records.push(Object.freeze({ ...record })); }
  list(): readonly AuditRecord[] { return this.records; }
}
