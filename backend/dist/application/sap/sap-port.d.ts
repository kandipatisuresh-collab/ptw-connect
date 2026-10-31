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
export interface SapServicePort {
    searchOrders(criteria: SapSearchCriteria): Promise<readonly SapReference[]>;
    searchNotifications(criteria: SapSearchCriteria): Promise<readonly SapReference[]>;
}
