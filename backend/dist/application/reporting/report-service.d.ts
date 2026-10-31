import { Permit } from '../../domain/permits/permit.js';
export declare function permitReport(permits: readonly Permit[]): {
    permitNumber: string;
    status: import("../../domain/shared/types.js").PermitStatus;
    plant: string;
    area: string;
    risk: string;
}[];
