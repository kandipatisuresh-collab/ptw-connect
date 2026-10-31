import { IncomingMessage, ServerResponse } from 'node:http';
import { PermitCommandService } from '../../application/permits/permit-command-service.js';
import { PermitQueryService } from '../../application/permits/permit-query-service.js';
import { DomainError } from '../../domain/shared/errors.js';
import { ActorContext } from '../../domain/shared/types.js';
import { errorResponse } from '../errors/error-response.js';
import { correlationId } from '../middleware/correlation.js';

export async function handlePermitRequest(
  request: IncomingMessage,
  response: ServerResponse,
  commands: PermitCommandService,
  queries: PermitQueryService,
): Promise<void> {
  const id = correlationId(request.headers);
  try {
    const actor = actorFromHeaders(request, id);
    const url = new URL(request.url ?? '/', 'http://localhost');
    const parts = url.pathname.split('/').filter(Boolean);
    if (request.method === 'GET' && parts.length === 2 && parts[0] === 'api' && parts[1] === 'permits') {
      return send(response, 200, queries.list(actor), id);
    }
    if (request.method === 'GET' && parts.length === 3 && parts[0] === 'api' && parts[1] === 'permits') {
      return send(response, 200, queries.get(parts[2]!, actor), id);
    }
    if (request.method === 'POST' && parts.length === 2 && parts[0] === 'api' && parts[1] === 'permits') {
      return send(response, 201, commands.create(await jsonBody(request), actor), id);
    }
    if (request.method === 'POST' && parts.length === 3 && parts[0] === 'api' && parts[1] === 'permits' && parts[2] === 'submit') {
      throw new DomainError('VALIDATION_ERROR', 'A permit id is required in /api/permits/{permitId}/submit.');
    }
    if (request.method === 'POST' && parts.length === 4 && parts[0] === 'api' && parts[1] === 'permits' && parts[3] === 'submit') {
      return send(response, 200, commands.submit(parts[2]!, actor), id);
    }
    return send(response, 404, { errorCode: 'NOT_FOUND', message: 'Route was not found.' }, id);
  } catch (error) {
    const result = errorResponse(error, id);
    send(response, result.status, result.body, id);
  }
}

function actorFromHeaders(request: IncomingMessage, id: string): ActorContext {
  const userId = request.headers['x-ptw-user'];
  const role = request.headers['x-ptw-role'];
  const plant = request.headers['x-ptw-plant'];
  const area = request.headers['x-ptw-area'];
  if ([userId, role, plant, area].some((value) => typeof value !== 'string' || value.length === 0)) {
    throw new DomainError('UNAUTHORIZED', 'Authenticated PTW actor headers are required.');
  }
  return { userId: userId as string, roles: [role as string], plantIds: [plant as string], areaIds: [area as string], correlationId: id };
}

async function jsonBody(request: IncomingMessage): Promise<any> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new DomainError('VALIDATION_ERROR', 'Request body must be valid JSON.'); }
}

function send(response: ServerResponse, status: number, body: unknown, id: string): void {
  response.statusCode = status;
  response.setHeader('content-type', 'application/json');
  response.setHeader('x-correlation-id', id);
  response.end(JSON.stringify(body));
}
