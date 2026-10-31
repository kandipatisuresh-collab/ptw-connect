import { DomainError } from '../shared/errors.js';

export type IsolationStatus = 'REQUESTED' | 'PLANNED' | 'APPLIED' | 'VERIFIED' | 'RELEASED';
const allowed: Record<IsolationStatus, readonly IsolationStatus[]> = {
  REQUESTED: ['PLANNED'], PLANNED: ['APPLIED'], APPLIED: ['VERIFIED'], VERIFIED: ['RELEASED'], RELEASED: [],
};

export interface Isolation { id: string; permitId: string; type: string; point: string; status: IsolationStatus; }
export function transitionIsolation(isolation: Isolation, next: IsolationStatus): Isolation {
  if (!allowed[isolation.status].includes(next)) throw new DomainError('INVALID_TRANSITION', `Cannot move isolation from ${isolation.status} to ${next}.`);
  return { ...isolation, status: next };
}
export function allRequiredIsolationsVerified(items: readonly Isolation[]): boolean {
  return items.every((item) => item.status === 'VERIFIED' || item.status === 'RELEASED');
}
