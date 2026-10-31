import { Permit } from '../../domain/permits/permit.js';
export function qrValue(permit: Permit): string { return permit.permitNumber; }
export function verificationView(permit: Permit) { return { permitNumber: permit.permitNumber, permitType: permit.permitTypeId, workDescription: permit.workDescription, location: permit.scope, status: permit.status, validFrom: permit.plannedStart, validTo: permit.plannedEnd }; }
