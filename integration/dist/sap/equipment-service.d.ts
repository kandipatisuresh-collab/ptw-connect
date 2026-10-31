import { SapReference, SapService } from './sap-service.js';
export interface EquipmentService {
    get(id: string): Promise<SapReference>;
}
export declare class SapEquipmentService implements EquipmentService {
    private readonly sap;
    constructor(sap: SapService);
    get(id: string): Promise<SapReference>;
}
