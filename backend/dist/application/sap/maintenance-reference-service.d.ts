import { SapReference, SapSearchCriteria, SapServicePort } from './sap-port.js';
export declare class MaintenanceReferenceService {
    private readonly sap;
    constructor(sap: SapServicePort);
    searchOrders(criteria: SapSearchCriteria): Promise<readonly SapReference[]>;
    searchNotifications(criteria: SapSearchCriteria): Promise<readonly SapReference[]>;
    snapshot(reference: SapReference): Promise<SapReference>;
}
