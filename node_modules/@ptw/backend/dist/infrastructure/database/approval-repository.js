export class ApprovalRepository {
    values = new Map();
    save(value) { this.values.set(value.id, value); return value; }
    get(id) { return this.values.get(id); }
    forPermit(permitId) { return [...this.values.values()].filter((value) => value.permitId === permitId); }
}
//# sourceMappingURL=approval-repository.js.map