import { SapReference, SapService } from './sap-service.js';
export interface FunctionalLocationService { get(id: string): Promise<SapReference>; }
export class SapFunctionalLocationService implements FunctionalLocationService { public constructor(private readonly sap: SapService) {} get(id: string) { return this.sap.getFunctionalLocation(id); } }
