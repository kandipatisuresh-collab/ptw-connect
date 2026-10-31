import { Permit } from '../../domain/permits/permit.js';
import { verificationView } from '../../application/qr/permit-qr-service.js';
export declare function verifyPermit(permit: Permit): ReturnType<typeof verificationView>;
