import { SapService } from '../sap/sap-service.js';
export function canPublishPermitStatus(sap: SapService): boolean { return sap.capabilities().has('permit-status-update'); }
