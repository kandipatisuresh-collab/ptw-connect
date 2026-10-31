export interface RiskRequest { hazard: string; likelihood: number; severity: number; controlMeasure: string; }
export interface GasTestRequest { oxygen: number; lel: number; h2s: number; co: number; instrumentId: string; calibrationDate: string; testedAt: string; }
export function requireFields(value: Record<string, unknown>, fields: readonly string[]): void { for (const field of fields) if (value[field] === undefined || value[field] === null) throw new Error(`${field} is required.`); }
