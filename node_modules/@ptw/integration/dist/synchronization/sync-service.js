export class SynchronizationService {
    store;
    constructor(store) {
        this.store = store;
    }
    async recordFailure(input) {
        await this.store.append({ ...input, status: 'FAILED' });
    }
}
//# sourceMappingURL=sync-service.js.map