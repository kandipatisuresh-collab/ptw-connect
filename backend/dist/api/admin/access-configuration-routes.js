import { DomainError } from '../../domain/shared/errors.js';
import { errorResponse } from '../errors/error-response.js';
import { correlationId } from '../middleware/correlation.js';
const roles = new Set([
    'PTW_ADMIN',
    'PERMIT_REQUESTER',
    'PERMIT_ISSUER',
    'SAFETY_OFFICER',
    'OPERATIONS_APPROVER',
    'MAINTENANCE_SUPERVISOR',
    'PLANT_MANAGER',
    'READ_ONLY_AUDITOR',
    'CONTRACTOR',
]);
const permissions = new Set([
    'PERMIT_CREATE', 'PERMIT_EDIT', 'PERMIT_SUBMIT', 'PERMIT_VIEW', 'PERMIT_APPROVE',
    'PERMIT_REJECT', 'PERMIT_ISSUE', 'PERMIT_SUSPEND', 'PERMIT_RESUME', 'PERMIT_EXTEND',
    'PERMIT_CLOSE', 'PERMIT_CANCEL', 'ACCESS_REQUEST_VIEW', 'ACCESS_REQUEST_APPROVE',
    'ACCESS_REQUEST_REJECT', 'USER_MANAGE', 'ROLE_MANAGE', 'ADMIN_ACCESS',
    'WORKFLOW_MANAGE', 'AUDIT_VIEW', 'REPORT_VIEW',
]);
const objectIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function handleAccessConfigurationRequest(request, response, store) {
    const id = correlationId(request.headers);
    try {
        if (process.env.NODE_ENV === 'production' || process.env.PTW_DEMO_ADMIN_ENABLED !== 'true') {
            throw new DomainError('FORBIDDEN', 'Demo access configuration is disabled.');
        }
        const remoteAddress = request.socket.remoteAddress;
        if (remoteAddress !== '127.0.0.1' && remoteAddress !== '::1' && remoteAddress !== '::ffff:127.0.0.1') {
            throw new DomainError('FORBIDDEN', 'Demo access configuration is available only from the local machine.');
        }
        if (!store)
            throw new DomainError('SERVICE_UNAVAILABLE', 'DATABASE_URL is required for access configuration persistence.');
        const url = new URL(request.url ?? '/', 'http://localhost');
        const parts = url.pathname.split('/').filter(Boolean);
        if (request.method === 'GET' && url.pathname === '/api/admin/configuration') {
            return send(response, 200, await store.getSnapshot(), id);
        }
        if (request.method === 'POST' && url.pathname === '/api/admin/users') {
            const body = await jsonBody(request);
            return send(response, 201, await store.saveUserAssignment(parseUser(body)), id);
        }
        if (request.method === 'PUT' && parts.length === 5 && parts[0] === 'api' && parts[1] === 'admin' && parts[2] === 'roles' && parts[4] === 'permissions') {
            const roleCode = parts[3] ?? '';
            if (!roles.has(roleCode))
                throw new DomainError('VALIDATION_ERROR', 'Unknown PTW role.');
            const body = await jsonBody(request);
            if (!Array.isArray(body.permissionCodes) || body.permissionCodes.some((code) => typeof code !== 'string' || !permissions.has(code))) {
                throw new DomainError('VALIDATION_ERROR', 'Permission codes must use the supported permission catalog.');
            }
            await store.saveRolePermissions(roleCode, body.permissionCodes);
            return send(response, 200, { roleCode, permissionCodes: body.permissionCodes }, id);
        }
        if (request.method === 'POST' && url.pathname === '/api/admin/work-order-mappings') {
            const body = await jsonBody(request);
            return send(response, 201, await store.saveWorkOrderMapping(parseWorkOrderMapping(body)), id);
        }
        return send(response, 404, { errorCode: 'NOT_FOUND', message: 'Admin configuration route was not found.' }, id);
    }
    catch (error) {
        const result = errorResponse(error, id);
        send(response, result.status, result.body, id);
    }
}
function parseUser(body) {
    const status = body.status;
    if (status !== 'Active' && status !== 'Pending' && status !== 'Inactive') {
        throw new DomainError('VALIDATION_ERROR', 'Access status must be Active, Pending, or Inactive.');
    }
    const input = {
        userId: requiredString(body.userId, 'User ID'),
        fullName: requiredString(body.fullName, 'Full name'),
        email: requiredString(body.email, 'Email').toLowerCase(),
        entraObjectId: requiredString(body.entraObjectId, 'Entra Object ID'),
        roleCode: requiredString(body.roleCode, 'PTW role'),
        plantId: requiredString(body.plantId, 'Plant ID'),
        status: status,
    };
    if (!objectIdPattern.test(input.entraObjectId))
        throw new DomainError('VALIDATION_ERROR', 'Entra Object ID must be a GUID.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email))
        throw new DomainError('VALIDATION_ERROR', 'Email address is invalid.');
    if (!roles.has(input.roleCode))
        throw new DomainError('VALIDATION_ERROR', 'Unknown PTW role.');
    return input;
}
function parseWorkOrderMapping(body) {
    return {
        permitNumber: requiredString(body.permitNumber, 'PTW number'),
        sapWorkOrderNumber: requiredString(body.sapWorkOrderNumber, 'SAP work order'),
        permitType: requiredString(body.permitType, 'Permit type'),
        requesterUserId: requiredString(body.requesterUserId, 'Requester'),
        approverUserId: requiredString(body.approverUserId, 'Approver'),
        issuerUserId: requiredString(body.issuerUserId, 'Issuer'),
        plantId: requiredString(body.plantId, 'Plant ID'),
    };
}
function requiredString(value, label) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('VALIDATION_ERROR', `${label} is required.`);
    }
    return value.trim();
}
async function jsonBody(request) {
    const chunks = [];
    let size = 0;
    for await (const chunk of request) {
        const data = Buffer.from(chunk);
        size += data.length;
        if (size > 64 * 1024)
            throw new DomainError('VALIDATION_ERROR', 'Request body is too large.');
        chunks.push(data);
    }
    try {
        const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        if (!body || typeof body !== 'object' || Array.isArray(body))
            throw new Error('body must be an object');
        return body;
    }
    catch {
        throw new DomainError('VALIDATION_ERROR', 'Request body must be a JSON object.');
    }
}
function send(response, status, body, id) {
    response.statusCode = status;
    response.setHeader('content-type', 'application/json');
    response.setHeader('x-correlation-id', id);
    response.end(JSON.stringify(body));
}
//# sourceMappingURL=access-configuration-routes.js.map