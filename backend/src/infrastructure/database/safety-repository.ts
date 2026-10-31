import { ChecklistAnswer, ChecklistItem, validateChecklist } from '../../domain/safety/checklist.js';
import { GasLimits, GasTestInput, validateGasTest } from '../../domain/safety/gas-test.js';
export class SafetyRepository {
  readonly checklists = new Map<string, ChecklistItem[]>();
  readonly answers = new Map<string, ChecklistAnswer[]>();
  readonly gasTests = new Map<string, ReturnType<typeof validateGasTest>[]>();
  validateChecklist(permitId: string): void { validateChecklist(this.checklists.get(permitId) ?? [], this.answers.get(permitId) ?? []); }
  addGasTest(permitId: string, input: GasTestInput, limits: GasLimits): ReturnType<typeof validateGasTest> { const result = validateGasTest(input, limits); this.gasTests.set(permitId, [...(this.gasTests.get(permitId) ?? []), result]); return result; }
}
