import { IsolationService } from '../../application/isolation/isolation-service.js';
export function transitionIsolation(service: IsolationService, id: string, status: 'REQUESTED' | 'PLANNED' | 'APPLIED' | 'VERIFIED' | 'RELEASED') { return service.transition(id, status); }
