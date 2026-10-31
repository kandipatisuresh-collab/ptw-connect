import { ActorContext } from '../../domain/shared/types.js';

export function actorFromClaims(claims: { subject: string; roles: readonly string[]; plantIds: readonly string[]; areaIds: readonly string[] }, correlationId: string): ActorContext {
  return { userId: claims.subject, roles: claims.roles, plantIds: claims.plantIds, areaIds: claims.areaIds, correlationId };
}
