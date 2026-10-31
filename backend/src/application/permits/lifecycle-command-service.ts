import { requireRole } from '../../domain/authorization/authorization.js';
import { transitionAudit } from '../../domain/audit/audit-service.js';
import { Permit } from '../../domain/permits/permit.js';
import { DomainError } from '../../domain/shared/errors.js';
import { ActorContext, PermitStatus } from '../../domain/shared/types.js';
import { assertTransition } from '../../domain/workflow/workflow-service.js';
import { PermitRepository } from '../../infrastructure/database/permit-repository.js';

const roleByTarget: Partial<Record<PermitStatus, string>> = { ISSUED: 'Permit Issuer', ACTIVE: 'Permit Issuer', SUSPENDED: 'Permit Issuer', RESUMED: 'Permit Issuer', CLOSED: 'Permit Issuer' };
export class LifecycleCommandService {
  public constructor(private readonly repository: PermitRepository) {}
  transition(id: string, target: PermitStatus, actor: ActorContext, reason = 'Lifecycle command'): Permit {
    const permit = this.repository.get(id);
    const role = roleByTarget[target];
    if (role) requireRole(actor, role);
    if (target === 'CLOSED' && permit.status !== 'CLOSURE_PENDING') throw new DomainError('SAFETY_GATE_BLOCKED', 'Permit must be pending closure before it can be closed.');
    assertTransition(permit.status, target);
    const audit = transitionAudit(permit.id, actor, reason, permit.status, target);
    return this.repository.save({ ...permit, status: target, version: permit.version + 1, updatedAt: audit.occurredAt, audit: [...permit.audit, audit] }, permit.version);
  }
}
