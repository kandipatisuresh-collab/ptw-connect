export class SapNotificationService {
    sap;
    constructor(sap) {
        this.sap = sap;
    }
    search(criteria) { return this.sap.searchNotifications(criteria); }
}
//# sourceMappingURL=notification-service.js.map