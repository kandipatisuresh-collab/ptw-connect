export function searchPermits(permits, query) { const normalized = query.trim().toLowerCase(); if (!normalized)
    return permits; return permits.filter((permit) => [permit.permitNumber, permit.title, permit.workDescription, permit.scope.plantId, permit.scope.areaId].some((value) => value.toLowerCase().includes(normalized))); }
//# sourceMappingURL=permit-search-service.js.map