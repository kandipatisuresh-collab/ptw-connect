import { SapReference, SapSearchCriteria, SapServicePort } from './sap-port.js';
export class MaintenanceReferenceService {
  public constructor(private readonly sap: SapServicePort) {}
  searchOrders(criteria: SapSearchCriteria): Promise<readonly SapReference[]> { return this.sap.searchOrders(criteria); }
  searchNotifications(criteria: SapSearchCriteria): Promise<readonly SapReference[]> { return this.sap.searchNotifications(criteria); }
  async snapshot(reference: SapReference): Promise<SapReference> { return Object.freeze({ ...reference, attributes: { ...reference.attributes } }); }
}
