import pg from 'pg';
const { Pool } = pg;
export class PostgresConnection {
    pool;
    constructor(connectionString = process.env.DATABASE_URL) {
        if (!connectionString)
            throw new Error('DATABASE_URL is required for PostgreSQL.');
        this.pool = new Pool({ connectionString, max: 10 });
    }
    async query(sql, parameters = []) {
        const result = await this.pool.query(sql, [...parameters]);
        return result.rows;
    }
    async transaction(callback) {
        const client = await this.pool.connect();
        const connection = {
            query: async (sql, parameters = []) => (await client.query(sql, [...parameters])).rows,
            transaction: async (nested) => nested(connection),
        };
        try {
            await client.query('begin');
            const value = await callback(connection);
            await client.query('commit');
            return value;
        }
        catch (error) {
            await client.query('rollback');
            throw error;
        }
        finally {
            client.release();
        }
    }
    async close() {
        await this.pool.end();
    }
}
//# sourceMappingURL=postgres-connection.js.map