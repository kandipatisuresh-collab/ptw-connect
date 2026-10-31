import { SapReference, SapSearchCriteria, SapService } from './sap-service.js';
export declare class UnconfiguredSapService implements SapService {
    searchNotifications(_criteria: SapSearchCriteria): Promise<readonly SapReference[]>;
    searchOrders(_criteria: SapSearchCriteria): Promise<readonly SapReference[]>;
    getEquipment(_businessId: string): Promise<SapReference>;
    getFunctionalLocation(_businessId: string): Promise<SapReference>;
    getWorkCenter(_businessId: string): Promise<SapReference>;
    capabilities(): ReadonlySet<string>;
}
