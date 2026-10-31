import type { IncomingMessage, ServerResponse } from 'node:http';
import type { AccessConfigurationStore } from '../../application/admin/access-configuration-store.js';
export declare function handleAccessConfigurationRequest(request: IncomingMessage, response: ServerResponse, store: AccessConfigurationStore | undefined): Promise<void>;
