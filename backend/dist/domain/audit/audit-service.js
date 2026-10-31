export function transitionAudit(entityId, actor, action, previousStatus, newStatus) {
    return {
        id: crypto.randomUUID(),
        entityId,
        action,
        actorId: actor.userId,
        role: actor.roles[0] ?? 'unknown',
        previousStatus,
        newStatus,
        correlationId: actor.correlationId,
        occurredAt: new Date().toISOString(),
    };
}
//# sourceMappingURL=audit-service.js.map