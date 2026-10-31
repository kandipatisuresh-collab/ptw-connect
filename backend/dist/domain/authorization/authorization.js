import { DomainError } from '../shared/errors.js';
export function requireRole(actor, role) {
    if (!actor.roles.includes(role)) {
        throw new DomainError('FORBIDDEN', `Role ${role} is required.`);
    }
}
export function requireScope(actor, scope) {
    if (!actor.plantIds.includes(scope.plantId) || !actor.areaIds.includes(scope.areaId)) {
        throw new DomainError('FORBIDDEN', 'The actor is outside the permit plant or area scope.');
    }
}
//# sourceMappingURL=authorization.js.map