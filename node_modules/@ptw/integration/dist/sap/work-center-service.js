export class SapWorkCenterService {
    sap;
    constructor(sap) {
        this.sap = sap;
    }
    get(id) { return this.sap.getWorkCenter(id); }
}
//# sourceMappingURL=work-center-service.js.map