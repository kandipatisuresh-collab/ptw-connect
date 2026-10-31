export class SapMaintenanceOrderService {
    sap;
    constructor(sap) {
        this.sap = sap;
    }
    search(criteria) { return this.sap.searchOrders(criteria); }
}
//# sourceMappingURL=maintenance-order-service.js.map