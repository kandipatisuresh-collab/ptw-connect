import { calculateRisk } from '../../domain/safety/risk-matrix.js';
export function assessRisk(input) { return calculateRisk(input.likelihood, input.severity); }
export function safetySummary(repository, permitId) { return { checklistItems: repository.checklists.get(permitId)?.length ?? 0, gasTests: repository.gasTests.get(permitId)?.length ?? 0 }; }
//# sourceMappingURL=safety-routes.js.map