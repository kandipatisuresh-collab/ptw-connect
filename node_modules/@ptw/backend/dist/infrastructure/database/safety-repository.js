import { validateChecklist } from '../../domain/safety/checklist.js';
import { validateGasTest } from '../../domain/safety/gas-test.js';
export class SafetyRepository {
    checklists = new Map();
    answers = new Map();
    gasTests = new Map();
    validateChecklist(permitId) { validateChecklist(this.checklists.get(permitId) ?? [], this.answers.get(permitId) ?? []); }
    addGasTest(permitId, input, limits) { const result = validateGasTest(input, limits); this.gasTests.set(permitId, [...(this.gasTests.get(permitId) ?? []), result]); return result; }
}
//# sourceMappingURL=safety-repository.js.map