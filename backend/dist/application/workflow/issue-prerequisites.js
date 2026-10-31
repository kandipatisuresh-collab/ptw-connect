import { DomainError } from '../../domain/shared/errors.js';
import { allRequiredIsolationsVerified } from '../../domain/isolation/isolation.js';
export function requireVerifiedIsolations(items) { if (!allRequiredIsolationsVerified(items))
    throw new DomainError('SAFETY_GATE_BLOCKED', 'All required isolations must be verified before issue.'); }
//# sourceMappingURL=issue-prerequisites.js.map