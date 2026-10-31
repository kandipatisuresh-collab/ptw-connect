import { errorResponse } from '../errors/error-response.js';
export async function handleLifecycle(request, response, service, actor) { const match = (request.url ?? '').match(/^\/api\/permits\/([^/]+)\/(issue|activate|suspend|resume|close)$/); if (request.method !== 'POST' || !match) {
    response.statusCode = 404;
    response.end();
    return;
} const target = { issue: 'ISSUED', activate: 'ACTIVE', suspend: 'SUSPENDED', resume: 'RESUMED', close: 'CLOSED' }; try {
    const permit = service.transition(match[1], target[match[2]], actor, `Permit ${match[2]}`);
    response.setHeader('content-type', 'application/json');
    response.end(JSON.stringify(permit));
}
catch (error) {
    const result = errorResponse(error, actor.correlationId);
    response.statusCode = result.status;
    response.setHeader('content-type', 'application/json');
    response.end(JSON.stringify(result.body));
} }
//# sourceMappingURL=lifecycle-routes.js.map