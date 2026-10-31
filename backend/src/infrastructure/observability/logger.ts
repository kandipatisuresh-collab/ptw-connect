const secretKeys = /token|password|secret|authorization|cookie/i;

export function sanitizeMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(metadata).map(([key, value]) => [key, secretKeys.test(key) ? '[REDACTED]' : value]));
}

export function logEvent(event: string, metadata: Record<string, unknown> = {}): void {
  process.stdout.write(`${JSON.stringify({ event, ...sanitizeMetadata(metadata), timestamp: new Date().toISOString() })}\n`);
}
