import { SapReference, SapService } from './sap-service.js';
export interface FunctionalLocationService {
    get(id: string): Promise<SapReference>;
}
export declare class SapFunctionalLocationService implements FunctionalLocationService {
    private readonly sap;
    constructor(sap: SapService);
    get(id: string): Promise<SapReference>;
}
