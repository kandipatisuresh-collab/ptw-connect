import { createServer } from 'node:http';
import { handleAccessConfigurationRequest } from './api/admin/access-configuration-routes.js';
import { handlePermitRequest } from './api/permits/permit-routes.js';
export function createPtwServer(commands, queries, accessConfigurationStore) {
    return createServer((request, response) => {
        if (request.url?.startsWith('/api/admin/')) {
            void handleAccessConfigurationRequest(request, response, accessConfigurationStore);
            return;
        }
        void handlePermitRequest(request, response, commands, queries);
    });
}
//# sourceMappingURL=server.js.map