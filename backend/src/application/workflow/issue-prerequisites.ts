import { DomainError } from '../../domain/shared/errors.js';
import { allRequiredIsolationsVerified, Isolation } from '../../domain/isolation/isolation.js';
export function requireVerifiedIsolations(items: readonly Isolation[]): void { if (!allRequiredIsolationsVerified(items)) throw new DomainError('SAFETY_GATE_BLOCKED', 'All required isolations must be verified before issue.'); }
