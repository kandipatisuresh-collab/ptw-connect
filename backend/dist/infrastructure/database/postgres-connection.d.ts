import pg from 'pg';
import { DatabaseConnection } from './connection.js';
export declare class PostgresConnection implements DatabaseConnection {
    readonly pool: pg.Pool;
    constructor(connectionString?: string | undefined);
    query<T extends pg.QueryResultRow>(sql: string, parameters?: readonly unknown[]): Promise<readonly T[]>;
    transaction<T>(callback: (connection: DatabaseConnection) => Promise<T>): Promise<T>;
    close(): Promise<void>;
}
