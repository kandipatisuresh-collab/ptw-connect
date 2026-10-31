import { SapReference, SapSearchCriteria, SapService } from './sap-service.js';

export interface MaintenanceOrderService { search(criteria: SapSearchCriteria): Promise<readonly SapReference[]>; }
export class SapMaintenanceOrderService implements MaintenanceOrderService {
  public constructor(private readonly sap: SapService) {}
  search(criteria: SapSearchCriteria): Promise<readonly SapReference[]> { return this.sap.searchOrders(criteria); }
}
