import type { QueryResultRow } from 'pg';
export interface DatabaseConnection {
    query<T extends QueryResultRow>(sql: string, parameters?: readonly unknown[]): Promise<readonly T[]>;
    transaction<T>(callback: (connection: DatabaseConnection) => Promise<T>): Promise<T>;
}
