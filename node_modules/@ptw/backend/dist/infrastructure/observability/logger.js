const secretKeys = /token|password|secret|authorization|cookie/i;
export function sanitizeMetadata(metadata) {
    return Object.fromEntries(Object.entries(metadata).map(([key, value]) => [key, secretKeys.test(key) ? '[REDACTED]' : value]));
}
export function logEvent(event, metadata = {}) {
    process.stdout.write(`${JSON.stringify({ event, ...sanitizeMetadata(metadata), timestamp: new Date().toISOString() })}\n`);
}
//# sourceMappingURL=logger.js.map