import { Permit } from '../../domain/permits/permit.js';
export function permitsToExpire(permits: readonly Permit[], now = new Date()): readonly Permit[] { return permits.filter((permit) => ['ISSUED', 'ACTIVE', 'SUSPENDED', 'RESUMED'].includes(permit.status) && new Date(permit.plannedEnd) <= now); }
