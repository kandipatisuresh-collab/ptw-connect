import { SapReference, SapSearchCriteria, SapService } from './sap-service.js';

export class UnconfiguredSapService implements SapService {
  async searchNotifications(_criteria: SapSearchCriteria): Promise<readonly SapReference[]> { throw new Error('SAP notification service is not configured.'); }
  async searchOrders(_criteria: SapSearchCriteria): Promise<readonly SapReference[]> { throw new Error('SAP order service is not configured.'); }
  async getEquipment(_businessId: string): Promise<SapReference> { throw new Error('SAP equipment service is not configured.'); }
  async getFunctionalLocation(_businessId: string): Promise<SapReference> { throw new Error('SAP functional-location service is not configured.'); }
  async getWorkCenter(_businessId: string): Promise<SapReference> { throw new Error('SAP work-center service is not configured.'); }
  capabilities(): ReadonlySet<string> { return new Set(); }
}
