import { SapReference, SapService } from './sap-service.js';
export interface WorkCenterService {
    get(id: string): Promise<SapReference>;
}
export declare class SapWorkCenterService implements WorkCenterService {
    private readonly sap;
    constructor(sap: SapService);
    get(id: string): Promise<SapReference>;
}
