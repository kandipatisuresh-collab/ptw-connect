import pg from 'pg';

if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
  throw new Error('The database bootstrap is available only in development or test mode.');
}

const adminConnectionString = process.env.DATABASE_ADMIN_URL;
const appConnectionString = process.env.DATABASE_URL;
if (!adminConnectionString || !appConnectionString) {
  throw new Error('DATABASE_ADMIN_URL and DATABASE_URL are required to create the local PTW database.');
}

const adminUrl = new URL(adminConnectionString);
const appUrl = new URL(appConnectionString);
const databaseName = decodeURIComponent(appUrl.pathname.replace(/^\//, ''));
const appRole = decodeURIComponent(appUrl.username);
const appPassword = decodeURIComponent(appUrl.password);
const validIdentifier = /^[a-zA-Z_][a-zA-Z0-9_]{0,62}$/;

if (!validIdentifier.test(databaseName)) throw new Error('DATABASE_URL must use a simple PostgreSQL database name.');
if (!validIdentifier.test(appRole)) throw new Error('DATABASE_URL must use a simple PostgreSQL username.');
if (!appPassword) throw new Error('DATABASE_URL must include an application-role password.');
if (adminUrl.protocol !== 'postgres:' && adminUrl.protocol !== 'postgresql:') throw new Error('DATABASE_ADMIN_URL must be a PostgreSQL URL.');

const quoteIdentifier = (value) => `"${value.replaceAll('"', '""')}"`;
const quoteLiteral = (value) => `'${value.replaceAll("'", "''")}'`;
const admin = new pg.Client({ connectionString: adminConnectionString });

await admin.connect();
try {
  const existingRole = await admin.query('select 1 from pg_roles where rolname = $1', [appRole]);
  if (existingRole.rowCount === 0) {
    await admin.query(`create role ${quoteIdentifier(appRole)} login password ${quoteLiteral(appPassword)}`);
    process.stdout.write('Created local PTW database role.\n');
  }

  const existingDatabase = await admin.query('select 1 from pg_database where datname = $1', [databaseName]);
  if (existingDatabase.rowCount === 0) {
    await admin.query(`create database ${quoteIdentifier(databaseName)} owner ${quoteIdentifier(appRole)}`);
    process.stdout.write(`Created PostgreSQL database ${databaseName}.\n`);
  } else {
    process.stdout.write(`PostgreSQL database ${databaseName} already exists.\n`);
  }

  await admin.query(`grant all privileges on database ${quoteIdentifier(databaseName)} to ${quoteIdentifier(appRole)}`);
} finally {
  await admin.end();
}

const targetAdminUrl = new URL(adminConnectionString);
targetAdminUrl.pathname = `/${databaseName}`;
const targetAdmin = new pg.Client({ connectionString: targetAdminUrl.toString() });
await targetAdmin.connect();
try {
  await targetAdmin.query(`grant usage, create on schema public to ${quoteIdentifier(appRole)}`);
} finally {
  await targetAdmin.end();
}

const app = new pg.Client({ connectionString: appConnectionString, connectionTimeoutMillis: 5000 });
await app.connect();
try {
  await app.query('select 1');
  process.stdout.write('PTW application database connection verified.\n');
} finally {
  await app.end();
}