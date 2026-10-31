import { InMemoryPermitRepository } from './infrastructure/database/permit-repository.js';
import { PermitCommandService } from './application/permits/permit-command-service.js';
import { PermitQueryService } from './application/permits/permit-query-service.js';
import { PostgresAccessConfigurationStore } from './infrastructure/database/postgres-access-configuration-store.js';
import { PostgresConnection } from './infrastructure/database/postgres-connection.js';
import { createPtwServer } from './server.js';

const repository = new InMemoryPermitRepository();
const database = process.env.DATABASE_URL ? new PostgresConnection(process.env.DATABASE_URL) : undefined;
const accessConfigurationStore = database ? new PostgresAccessConfigurationStore(database) : undefined;
const server = createPtwServer(new PermitCommandService(repository), new PermitQueryService(repository), accessConfigurationStore);
const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');
server.listen(port, host, () => process.stdout.write(`PTW API listening on http://${host}:${port}\n`));
server.on('close', () => { void database?.close(); });
