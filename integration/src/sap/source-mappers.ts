import { SapReference } from './sap-service.js';
export function sourceSnapshot(reference: SapReference): Record<string, unknown> { return { objectType: reference.objectType, businessId: reference.businessId, description: reference.description, sourceTimestamp: reference.sourceTimestamp, attributes: { ...reference.attributes } }; }
