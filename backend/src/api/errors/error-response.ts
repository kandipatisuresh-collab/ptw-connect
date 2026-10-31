import { DomainError } from '../../domain/shared/errors.js';

export function errorResponse(error: unknown, correlationId: string): { status: number; body: Record<string, unknown> } {
  if (error instanceof DomainError) {
    const status = error.code === 'SERVICE_UNAVAILABLE' ? 503 : error.code === 'UNAUTHORIZED' ? 401 : error.code === 'FORBIDDEN' ? 403 : error.code === 'NOT_FOUND' ? 404 : error.code === 'CONFLICT' ? 409 : 400;
    return { status, body: { errorCode: error.code, message: error.message, correlationId, timestamp: new Date().toISOString(), details: error.details } };
  }
  return { status: 500, body: { errorCode: 'INTERNAL_ERROR', message: 'An unexpected error occurred.', correlationId, timestamp: new Date().toISOString() } };
}
