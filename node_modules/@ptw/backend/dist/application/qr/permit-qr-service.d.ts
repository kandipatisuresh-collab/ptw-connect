import { Permit } from '../../domain/permits/permit.js';
export declare function qrValue(permit: Permit): string;
export declare function verificationView(permit: Permit): {
    permitNumber: string;
    permitType: string;
    workDescription: string;
    location: import("../../domain/authorization/authorization.js").PermitScope;
    status: import("../../domain/shared/types.js").PermitStatus;
    validFrom: string;
    validTo: string;
};
