import { SapReference, SapSearchCriteria, SapService } from './sap-service.js';
export interface NotificationService {
    search(criteria: SapSearchCriteria): Promise<readonly SapReference[]>;
}
export declare class SapNotificationService implements NotificationService {
    private readonly sap;
    constructor(sap: SapService);
    search(criteria: SapSearchCriteria): Promise<readonly SapReference[]>;
}
