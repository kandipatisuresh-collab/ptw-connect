import { DomainError } from '../shared/errors.js';
const allowed = {
    REQUESTED: ['PLANNED'], PLANNED: ['APPLIED'], APPLIED: ['VERIFIED'], VERIFIED: ['RELEASED'], RELEASED: [],
};
export function transitionIsolation(isolation, next) {
    if (!allowed[isolation.status].includes(next))
        throw new DomainError('INVALID_TRANSITION', `Cannot move isolation from ${isolation.status} to ${next}.`);
    return { ...isolation, status: next };
}
export function allRequiredIsolationsVerified(items) {
    return items.every((item) => item.status === 'VERIFIED' || item.status === 'RELEASED');
}
//# sourceMappingURL=isolation.js.map