import { ActorContext } from '../shared/types.js';
export interface PermitScope {
    plantId: string;
    areaId: string;
}
export declare function requireRole(actor: ActorContext, role: string): void;
export declare function requireScope(actor: ActorContext, scope: PermitScope): void;
