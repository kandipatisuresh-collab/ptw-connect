import { randomUUID } from 'node:crypto';
import { IncomingHttpHeaders } from 'node:http';

export function correlationId(headers: IncomingHttpHeaders): string {
  const value = headers['x-correlation-id'];
  return typeof value === 'string' && value.length > 0 ? value : randomUUID();
}
