import { Permit } from '../../domain/permits/permit.js';
export function permitReport(permits: readonly Permit[]) { return permits.map((permit) => ({ permitNumber: permit.permitNumber, status: permit.status, plant: permit.scope.plantId, area: permit.scope.areaId, risk: 'Configured by assessment' })); }
