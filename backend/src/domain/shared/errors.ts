export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INVALID_TRANSITION'
  | 'SAFETY_GATE_BLOCKED'
  | 'INTEGRATION_ERROR'
  | 'SERVICE_UNAVAILABLE';

export class DomainError extends Error {
  public constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export interface SafeErrorResponse {
  errorCode: ErrorCode;
  message: string;
  correlationId: string;
  timestamp: string;
  details?: Record<string, unknown>;
}
