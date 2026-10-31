import { DomainError } from '../shared/errors.js';
export interface Attachment { id: string; permitId: string; category: string; name: string; size: number; contentType: string; scanState: 'PENDING' | 'CLEAN' | 'QUARANTINED'; reference: string; }
const allowedTypes = new Set(['application/pdf', 'image/jpeg', 'image/png']);
export function validateAttachment(input: Pick<Attachment, 'name' | 'size' | 'contentType'>): void { if (!allowedTypes.has(input.contentType)) throw new DomainError('VALIDATION_ERROR', 'Attachment type is not allowed.'); if (input.size > 25 * 1024 * 1024) throw new DomainError('VALIDATION_ERROR', 'Attachment exceeds the 25 MB limit.'); }
