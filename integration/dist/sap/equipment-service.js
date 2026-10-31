export class SapEquipmentService {
    sap;
    constructor(sap) {
        this.sap = sap;
    }
    get(id) { return this.sap.getEquipment(id); }
}
//# sourceMappingURL=equipment-service.js.map