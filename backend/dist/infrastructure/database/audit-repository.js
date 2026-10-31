export class InMemoryAuditRepository {
    records = [];
    append(record) { this.records.push(Object.freeze({ ...record })); }
    list() { return this.records; }
}
//# sourceMappingURL=audit-repository.js.map