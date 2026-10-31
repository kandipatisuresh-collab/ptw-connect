export class MaintenanceReferenceService {
    sap;
    constructor(sap) {
        this.sap = sap;
    }
    searchOrders(criteria) { return this.sap.searchOrders(criteria); }
    searchNotifications(criteria) { return this.sap.searchNotifications(criteria); }
    async snapshot(reference) { return Object.freeze({ ...reference, attributes: { ...reference.attributes } }); }
}
//# sourceMappingURL=maintenance-reference-service.js.map