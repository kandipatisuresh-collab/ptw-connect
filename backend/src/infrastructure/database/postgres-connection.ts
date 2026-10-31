import pg from 'pg';
import { DatabaseConnection } from './connection.js';

const { Pool } = pg;

export class PostgresConnection implements DatabaseConnection {
  public readonly pool: pg.Pool;

  public constructor(connectionString = process.env.DATABASE_URL) {
    if (!connectionString) throw new Error('DATABASE_URL is required for PostgreSQL.');
    this.pool = new Pool({ connectionString, max: 10 });
  }

  async query<T extends pg.QueryResultRow>(sql: string, parameters: readonly unknown[] = []): Promise<readonly T[]> {
    const result = await this.pool.query<T>(sql, [...parameters]);
    return result.rows;
  }

  async transaction<T>(callback: (connection: DatabaseConnection) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    const connection: DatabaseConnection = {
      query: async <R extends pg.QueryResultRow>(sql: string, parameters: readonly unknown[] = []) => (await client.query<R>(sql, [...parameters])).rows,
      transaction: async <R>(nested: (nestedConnection: DatabaseConnection) => Promise<R>) => nested(connection),
    };
    try {
      await client.query('begin');
      const value = await callback(connection);
      await client.query('commit');
      return value;
    } catch (error) {
      await client.query('rollback');
      throw error;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
