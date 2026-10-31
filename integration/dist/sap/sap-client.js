export class UnconfiguredSapService {
    async searchNotifications(_criteria) { throw new Error('SAP notification service is not configured.'); }
    async searchOrders(_criteria) { throw new Error('SAP order service is not configured.'); }
    async getEquipment(_businessId) { throw new Error('SAP equipment service is not configured.'); }
    async getFunctionalLocation(_businessId) { throw new Error('SAP functional-location service is not configured.'); }
    async getWorkCenter(_businessId) { throw new Error('SAP work-center service is not configured.'); }
    capabilities() { return new Set(); }
}
//# sourceMappingURL=sap-client.js.map