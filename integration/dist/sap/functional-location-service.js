export class SapFunctionalLocationService {
    sap;
    constructor(sap) {
        this.sap = sap;
    }
    get(id) { return this.sap.getFunctionalLocation(id); }
}
//# sourceMappingURL=functional-location-service.js.map