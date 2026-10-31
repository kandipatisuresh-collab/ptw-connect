import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRisk } from '../../dist/domain/safety/risk-matrix.js';
import { validateChecklist } from '../../dist/domain/safety/checklist.js';
import { validateGasTest } from '../../dist/domain/safety/gas-test.js';
import { transitionIsolation } from '../../dist/domain/isolation/isolation.js';

test('calculates critical risk and escalation', () => assert.deepEqual(calculateRisk(5, 5), { score: 25, category: 'Critical', requiresAdditionalApproval: true }));
test('blocks incomplete mandatory checklist', () => assert.throws(() => validateChecklist([{ id: 'fire-watch', question: 'Fire watch', mandatory: true }], []), /incomplete/));
test('warns on unsafe gas reading', () => assert.equal(validateGasTest({ oxygen: 20.9, lel: 12, h2s: 0, co: 0, instrumentId: 'i-1', calibrationDate: '2026-09-01', testedAt: '2026-09-20T08:00:00Z' }, { oxygenMin: 19.5, oxygenMax: 23.5, lelMax: 10, h2sMax: 10, coMax: 25 }).passed, false));
test('rejects skipped isolation states', () => assert.throws(() => transitionIsolation({ id: 'i', permitId: 'p', type: 'Electrical', point: 'P-1', status: 'REQUESTED' }, 'VERIFIED'), /Cannot move/));
