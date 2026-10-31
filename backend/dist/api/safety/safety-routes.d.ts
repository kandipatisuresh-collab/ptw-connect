import { SafetyRepository } from '../../infrastructure/database/safety-repository.js';
export declare function assessRisk(input: {
    likelihood: number;
    severity: number;
}): {
    score: number;
    category: "Low" | "Medium" | "High" | "Critical";
    requiresAdditionalApproval: boolean;
};
export declare function safetySummary(repository: SafetyRepository, permitId: string): {
    checklistItems: number;
    gasTests: number;
};
