import { Permit } from '../../domain/permits/permit.js';
export function dashboardSummary(permits: readonly Permit[]) { return permits.reduce<Record<string, number>>((summary, permit) => { summary.total = (summary.total ?? 0) + 1; summary[permit.status] = (summary[permit.status] ?? 0) + 1; return summary; }, {}); }
