import { createServer, Server } from 'node:http';
import { PermitCommandService } from './application/permits/permit-command-service.js';
import { PermitQueryService } from './application/permits/permit-query-service.js';
import type { AccessConfigurationStore } from './application/admin/access-configuration-store.js';
import { handleAccessConfigurationRequest } from './api/admin/access-configuration-routes.js';
import { handlePermitRequest } from './api/permits/permit-routes.js';

export function createPtwServer(
  commands: PermitCommandService,
  queries: PermitQueryService,
  accessConfigurationStore?: AccessConfigurationStore,
): Server {
  return createServer((request, response) => {
    if (request.url?.startsWith('/api/admin/')) {
      void handleAccessConfigurationRequest(request, response, accessConfigurationStore);
      return;
    }
    void handlePermitRequest(request, response, commands, queries);
  });
}
