export type ErrorCode = 'VALIDATION_ERROR' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'INVALID_TRANSITION' | 'SAFETY_GATE_BLOCKED' | 'INTEGRATION_ERROR' | 'SERVICE_UNAVAILABLE';
export declare class DomainError extends Error {
    readonly code: ErrorCode;
    readonly details: Record<string, unknown>;
    constructor(code: ErrorCode, message: string, details?: Record<string, unknown>);
}
export interface SafeErrorResponse {
    errorCode: ErrorCode;
    message: string;
    correlationId: string;
    timestamp: string;
    details?: Record<string, unknown>;
}
