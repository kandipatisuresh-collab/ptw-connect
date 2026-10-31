export interface ContractResponse<T = unknown> { status: number; body: T; correlationId?: string; }
export function assertSafeError(response: ContractResponse<Record<string, unknown>>): void {
  if (typeof response.body.errorCode !== 'string' || typeof response.body.message !== 'string' || typeof response.body.correlationId !== 'string') throw new Error('Response is not a safe PTW error.');
}
