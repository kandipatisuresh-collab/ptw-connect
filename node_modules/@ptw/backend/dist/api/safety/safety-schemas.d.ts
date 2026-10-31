export interface RiskRequest {
    hazard: string;
    likelihood: number;
    severity: number;
    controlMeasure: string;
}
export interface GasTestRequest {
    oxygen: number;
    lel: number;
    h2s: number;
    co: number;
    instrumentId: string;
    calibrationDate: string;
    testedAt: string;
}
export declare function requireFields(value: Record<string, unknown>, fields: readonly string[]): void;
