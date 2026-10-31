import { SapService } from './sap-service.js';
export function supportedSapCapabilities(sap: SapService): readonly string[] { return [...sap.capabilities()].sort(); }
