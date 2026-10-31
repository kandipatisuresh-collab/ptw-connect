import { SapReference, SapSearchCriteria, SapService } from './sap-service.js';

export interface NotificationService { search(criteria: SapSearchCriteria): Promise<readonly SapReference[]>; }
export class SapNotificationService implements NotificationService {
  public constructor(private readonly sap: SapService) {}
  search(criteria: SapSearchCriteria): Promise<readonly SapReference[]> { return this.sap.searchNotifications(criteria); }
}
