import { SapReference, SapSearchCriteria, SapService } from './sap-service.js';
export interface MaintenanceOrderService {
    search(criteria: SapSearchCriteria): Promise<readonly SapReference[]>;
}
export declare class SapMaintenanceOrderService implements MaintenanceOrderService {
    private readonly sap;
    constructor(sap: SapService);
    search(criteria: SapSearchCriteria): Promise<readonly SapReference[]>;
}
