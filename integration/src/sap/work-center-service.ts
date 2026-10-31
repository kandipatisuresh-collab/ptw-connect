import { SapReference, SapService } from './sap-service.js';
export interface WorkCenterService { get(id: string): Promise<SapReference>; }
export class SapWorkCenterService implements WorkCenterService { public constructor(private readonly sap: SapService) {} get(id: string) { return this.sap.getWorkCenter(id); } }
