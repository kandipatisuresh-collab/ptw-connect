import { randomUUID } from 'node:crypto';
export function correlationId(headers) {
    const value = headers['x-correlation-id'];
    return typeof value === 'string' && value.length > 0 ? value : randomUUID();
}
//# sourceMappingURL=correlation.js.map