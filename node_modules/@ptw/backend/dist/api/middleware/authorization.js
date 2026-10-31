export function actorFromClaims(claims, correlationId) {
    return { userId: claims.subject, roles: claims.roles, plantIds: claims.plantIds, areaIds: claims.areaIds, correlationId };
}
//# sourceMappingURL=authorization.js.map