export interface SapSearchCriteria {
    search?: string;
    plantId?: string;
    page?: number;
    pageSize?: number;
}
export interface SapReference {
    objectType: string;
    businessId: string;
    description: string;
    plantId?: string;
    areaId?: string;
    status?: string;
    sourceTimestamp: string;
    attributes: Record<string, string | number | boolean | null>;
}
export interface SapService {
    searchNotifications(criteria: SapSearchCriteria): Promise<readonly SapReference[]>;
    searchOrders(criteria: SapSearchCriteria): Promise<readonly SapReference[]>;
    getEquipment(businessId: string): Promise<SapReference>;
    getFunctionalLocation(businessId: string): Promise<SapReference>;
    getWorkCenter(businessId: string): Promise<SapReference>;
    capabilities(): ReadonlySet<string>;
}
