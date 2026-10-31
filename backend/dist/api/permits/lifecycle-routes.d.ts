import { IncomingMessage, ServerResponse } from 'node:http';
import { LifecycleCommandService } from '../../application/permits/lifecycle-command-service.js';
import { ActorContext } from '../../domain/shared/types.js';
export declare function handleLifecycle(request: IncomingMessage, response: ServerResponse, service: LifecycleCommandService, actor: ActorContext): Promise<void>;
