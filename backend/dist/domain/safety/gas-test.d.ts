export interface GasLimits {
    oxygenMin: number;
    oxygenMax: number;
    lelMax: number;
    h2sMax: number;
    coMax: number;
}
export interface GasTestInput {
    oxygen: number;
    lel: number;
    h2s: number;
    co: number;
    instrumentId: string;
    calibrationDate: string;
    testedAt: string;
}
export declare function validateGasTest(input: GasTestInput, limits: GasLimits, now?: Date): {
    passed: boolean;
    warnings: string[];
};
