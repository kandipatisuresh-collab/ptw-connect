import { SapReference, SapService } from './sap-service.js';
export interface EquipmentService { get(id: string): Promise<SapReference>; }
export class SapEquipmentService implements EquipmentService { public constructor(private readonly sap: SapService) {} get(id: string) { return this.sap.getEquipment(id); } }
