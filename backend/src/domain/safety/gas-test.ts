import { DomainError } from '../shared/errors.js';

export interface GasLimits { oxygenMin: number; oxygenMax: number; lelMax: number; h2sMax: number; coMax: number; }
export interface GasTestInput { oxygen: number; lel: number; h2s: number; co: number; instrumentId: string; calibrationDate: string; testedAt: string; }

export function validateGasTest(input: GasTestInput, limits: GasLimits, now = new Date()): { passed: boolean; warnings: string[] } {
  if (!input.instrumentId || !input.calibrationDate) throw new DomainError('VALIDATION_ERROR', 'Instrument and calibration date are required.');
  if (new Date(input.calibrationDate) > now) throw new DomainError('VALIDATION_ERROR', 'Calibration date cannot be in the future.');
  const warnings: string[] = [];
  if (input.oxygen < limits.oxygenMin || input.oxygen > limits.oxygenMax) warnings.push('OXYGEN_OUT_OF_RANGE');
  if (input.lel > limits.lelMax) warnings.push('LEL_OVER_LIMIT');
  if (input.h2s > limits.h2sMax) warnings.push('H2S_OVER_LIMIT');
  if (input.co > limits.coMax) warnings.push('CO_OVER_LIMIT');
  return { passed: warnings.length === 0, warnings };
}
