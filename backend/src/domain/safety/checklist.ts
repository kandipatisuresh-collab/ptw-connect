import { DomainError } from '../shared/errors.js';

export type ChecklistResponse = 'YES' | 'NO' | 'N/A';
export interface ChecklistItem { id: string; question: string; mandatory: boolean; }
export interface ChecklistAnswer { itemId: string; response: ChecklistResponse; comment?: string; }

export function validateChecklist(items: readonly ChecklistItem[], answers: readonly ChecklistAnswer[]): void {
  const byId = new Map(answers.map((answer) => [answer.itemId, answer]));
  const missing = items.filter((item) => item.mandatory && !byId.has(item.id));
  if (missing.length > 0) throw new DomainError('SAFETY_GATE_BLOCKED', 'Mandatory checklist items are incomplete.', { itemIds: missing.map((item) => item.id) });
  const negative = items.filter((item) => item.mandatory && byId.get(item.id)?.response === 'NO');
  if (negative.length > 0) throw new DomainError('SAFETY_GATE_BLOCKED', 'Mandatory checklist items have a negative response.', { itemIds: negative.map((item) => item.id) });
}
