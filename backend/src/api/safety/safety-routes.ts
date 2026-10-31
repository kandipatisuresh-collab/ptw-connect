import { calculateRisk } from '../../domain/safety/risk-matrix.js';
import { SafetyRepository } from '../../infrastructure/database/safety-repository.js';
export function assessRisk(input: { likelihood: number; severity: number }) { return calculateRisk(input.likelihood, input.severity); }
export function safetySummary(repository: SafetyRepository, permitId: string) { return { checklistItems: repository.checklists.get(permitId)?.length ?? 0, gasTests: repository.gasTests.get(permitId)?.length ?? 0 }; }
