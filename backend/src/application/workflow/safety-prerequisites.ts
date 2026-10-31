import { DomainError } from '../../domain/shared/errors.js';
import { SafetyRepository } from '../../infrastructure/database/safety-repository.js';
export function requireSafetyControls(repository: SafetyRepository, permitId: string): void { try { repository.validateChecklist(permitId); } catch (error) { if (error instanceof DomainError) throw error; throw new DomainError('SAFETY_GATE_BLOCKED', 'Safety controls are incomplete.'); } }
