import { Server } from 'node:http';
import { PermitCommandService } from './application/permits/permit-command-service.js';
import { PermitQueryService } from './application/permits/permit-query-service.js';
import type { AccessConfigurationStore } from './application/admin/access-configuration-store.js';
export declare function createPtwServer(commands: PermitCommandService, queries: PermitQueryService, accessConfigurationStore?: AccessConfigurationStore): Server;
