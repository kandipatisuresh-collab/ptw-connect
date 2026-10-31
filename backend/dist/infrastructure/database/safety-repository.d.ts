import { ChecklistAnswer, ChecklistItem } from '../../domain/safety/checklist.js';
import { GasLimits, GasTestInput, validateGasTest } from '../../domain/safety/gas-test.js';
export declare class SafetyRepository {
    readonly checklists: Map<string, ChecklistItem[]>;
    readonly answers: Map<string, ChecklistAnswer[]>;
    readonly gasTests: Map<string, {
        passed: boolean;
        warnings: string[];
    }[]>;
    validateChecklist(permitId: string): void;
    addGasTest(permitId: string, input: GasTestInput, limits: GasLimits): ReturnType<typeof validateGasTest>;
}
