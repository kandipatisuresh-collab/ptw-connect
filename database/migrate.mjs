import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import pg from 'pg';

const { Client } = pg;
const migrations = [
  '001_foundation.sql',
  '002_permits.sql',
  '003_risk_and_safety.sql',
  '004_isolation_and_approval.sql',
  '005_sap_and_reporting.sql',
  '006_operational_hardening.sql',
  '007_access_configuration.sql',
];

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  await client.query('create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())');
  for (const name of migrations) {
    const applied = await client.query('select 1 from schema_migrations where name = $1', [name]);
    if (applied.rowCount) continue;
    await client.query('begin');
    try {
      await client.query(await readFile(resolve('database', 'migrations', name), 'utf8'));
      await client.query('insert into schema_migrations (name) values ($1)', [name]);
      await client.query('commit');
      console.log(`Applied ${name}`);
    } catch (error) {
      await client.query('rollback');
      throw error;
    }
  }
} finally {
  await client.end();
}
