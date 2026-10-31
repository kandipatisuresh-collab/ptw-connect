const counters = new Map();
export function incrementMetric(name) { counters.set(name, (counters.get(name) ?? 0) + 1); }
export function metricsSnapshot() { return Object.fromEntries(counters); }
//# sourceMappingURL=metrics.js.map