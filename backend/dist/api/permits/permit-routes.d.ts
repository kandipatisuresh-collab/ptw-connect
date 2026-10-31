import { IncomingMessage, ServerResponse } from 'node:http';
import { PermitCommandService } from '../../application/permits/permit-command-service.js';
import { PermitQueryService } from '../../application/permits/permit-query-service.js';
export declare function handlePermitRequest(request: IncomingMessage, response: ServerResponse, commands: PermitCommandService, queries: PermitQueryService): Promise<void>;
