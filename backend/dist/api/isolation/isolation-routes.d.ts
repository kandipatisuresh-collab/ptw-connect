import { IsolationService } from '../../application/isolation/isolation-service.js';
export declare function transitionIsolation(service: IsolationService, id: string, status: 'REQUESTED' | 'PLANNED' | 'APPLIED' | 'VERIFIED' | 'RELEASED'): import("../../domain/isolation/isolation.js").Isolation;
