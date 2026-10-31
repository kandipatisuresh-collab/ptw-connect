import { ActorContext } from '../shared/types.js';
import { DomainError } from '../shared/errors.js';

export interface PermitScope {
  plantId: string;
  areaId: string;
}

export function requireRole(actor: ActorContext, role: string): void {
  if (!actor.roles.includes(role)) {
    throw new DomainError('FORBIDDEN', `Role ${role} is required.`);
  }
}

export function requireScope(actor: ActorContext, scope: PermitScope): void {
  if (!actor.plantIds.includes(scope.plantId) || !actor.areaIds.includes(scope.areaId)) {
    throw new DomainError('FORBIDDEN', 'The actor is outside the permit plant or area scope.');
  }
}
