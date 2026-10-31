import { DomainError } from '../shared/errors.js';
export function validateChecklist(items, answers) {
    const byId = new Map(answers.map((answer) => [answer.itemId, answer]));
    const missing = items.filter((item) => item.mandatory && !byId.has(item.id));
    if (missing.length > 0)
        throw new DomainError('SAFETY_GATE_BLOCKED', 'Mandatory checklist items are incomplete.', { itemIds: missing.map((item) => item.id) });
    const negative = items.filter((item) => item.mandatory && byId.get(item.id)?.response === 'NO');
    if (negative.length > 0)
        throw new DomainError('SAFETY_GATE_BLOCKED', 'Mandatory checklist items have a negative response.', { itemIds: negative.map((item) => item.id) });
}
//# sourceMappingURL=checklist.js.map