export function qrValue(permit) { return permit.permitNumber; }
export function verificationView(permit) { return { permitNumber: permit.permitNumber, permitType: permit.permitTypeId, workDescription: permit.workDescription, location: permit.scope, status: permit.status, validFrom: permit.plannedStart, validTo: permit.plannedEnd }; }
//# sourceMappingURL=permit-qr-service.js.map