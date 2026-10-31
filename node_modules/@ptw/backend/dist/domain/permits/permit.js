import { requireRole, requireScope } from '../authorization/authorization.js';
import { transitionAudit } from '../audit/audit-service.js';
import { DomainError } from '../shared/errors.js';
import { assertTransition } from '../workflow/workflow-service.js';
export function createPermit(input, actor, sequence) {
    requireRole(actor, 'Permit Requester');
    requireScope(actor, { plantId: input.plantId, areaId: input.areaId });
    validateDraft(input);
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    return {
        id,
        version: 1,
        createdAt: now,
        updatedAt: now,
        permitNumber: `PTW-${new Date().getUTCFullYear()}-${String(sequence).padStart(6, '0')}`,
        status: 'DRAFT',
        requestedBy: actor.userId,
        scope: { plantId: input.plantId, areaId: input.areaId },
        permitTypeId: input.permitTypeId,
        title: input.title.trim(),
        workDescription: input.workDescription.trim(),
        plannedStart: input.plannedStart,
        plannedEnd: input.plannedEnd,
        audit: [],
        ...(input.contractor?.trim() ? { contractor: input.contractor.trim() } : {}),
        ...(input.workerCount !== undefined ? { workerCount: input.workerCount } : {}),
    };
}
export function submitPermit(permit, actor) {
    requireRole(actor, 'Permit Requester');
    requireScope(actor, permit.scope);
    if (permit.requestedBy !== actor.userId) {
        throw new DomainError('FORBIDDEN', 'Only the requester may submit this draft.');
    }
    assertTransition(permit.status, 'SUBMITTED');
    const audit = transitionAudit(permit.id, actor, 'Permit Submitted', permit.status, 'SUBMITTED');
    return { ...permit, status: 'SUBMITTED', version: permit.version + 1, updatedAt: audit.occurredAt, audit: [...permit.audit, audit] };
}
function validateDraft(input) {
    if (!input.permitTypeId || !input.title.trim() || !input.workDescription.trim()) {
        throw new DomainError('VALIDATION_ERROR', 'Permit type, title, and work description are required.');
    }
    if (!input.plantId || !input.areaId) {
        throw new DomainError('VALIDATION_ERROR', 'Plant and area are required.');
    }
    if (new Date(input.plannedEnd) <= new Date(input.plannedStart)) {
        throw new DomainError('VALIDATION_ERROR', 'Planned end must be after planned start.');
    }
    if (input.workerCount !== undefined && (!Number.isInteger(input.workerCount) || input.workerCount < 1)) {
        throw new DomainError('VALIDATION_ERROR', 'Worker count must be a positive integer.');
    }
}
//# sourceMappingURL=permit.js.map