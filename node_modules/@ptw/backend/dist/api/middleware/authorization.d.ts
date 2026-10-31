import { ActorContext } from '../../domain/shared/types.js';
export declare function actorFromClaims(claims: {
    subject: string;
    roles: readonly string[];
    plantIds: readonly string[];
    areaIds: readonly string[];
}, correlationId: string): ActorContext;
