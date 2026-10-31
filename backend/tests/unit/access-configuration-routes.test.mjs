import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'node:http';
import { handleAccessConfigurationRequest } from '../../dist/api/admin/access-configuration-routes.js';

async function withServer(store, action) {
  const server = createServer((request, response) => {
    void handleAccessConfigurationRequest(request, response, store);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  try {
    return await action(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

async function withEnvironment(values, action) {
  const previous = Object.fromEntries(Object.keys(values).map((key) => [key, process.env[key]]));
  for (const [key, value] of Object.entries(values)) process.env[key] = value;
  try {
    return await action();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test('configuration API is disabled in production even when demo flag is set', async () => {
  await withEnvironment({ NODE_ENV: 'production', PTW_DEMO_ADMIN_ENABLED: 'true' }, async () => {
    const response = await withServer({}, (baseUrl) => fetch(`${baseUrl}/api/admin/configuration`));
    assert.equal(response.status, 403);
    assert.equal((await response.json()).errorCode, 'FORBIDDEN');
  });
});

test('configuration API returns service unavailable without a PostgreSQL store', async () => {
  await withEnvironment({ NODE_ENV: 'development', PTW_DEMO_ADMIN_ENABLED: 'true' }, async () => {
    const response = await withServer(undefined, (baseUrl) => fetch(`${baseUrl}/api/admin/configuration`));
    assert.equal(response.status, 503);
    assert.equal((await response.json()).errorCode, 'SERVICE_UNAVAILABLE');
  });
});

test('user assignments validate Entra object ID before persistence', async () => {
  let saveCalled = false;
  const store = { saveUserAssignment: async () => { saveCalled = true; } };
  await withEnvironment({ NODE_ENV: 'development', PTW_DEMO_ADMIN_ENABLED: 'true' }, async () => {
    const response = await withServer(store, (baseUrl) => fetch(`${baseUrl}/api/admin/users`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        userId: 'U001',
        fullName: 'Test User',
        email: 'test@example.invalid',
        entraObjectId: 'not-a-guid',
        roleCode: 'PERMIT_REQUESTER',
        plantId: '1000',
        status: 'Active',
      }),
    }));
    assert.equal(response.status, 400);
    assert.equal((await response.json()).message, 'Entra Object ID must be a GUID.');
    assert.equal(saveCalled, false);
  });
});

test('valid user assignments are forwarded to the PostgreSQL store', async () => {
  let savedUser;
  const store = { saveUserAssignment: async (input) => { savedUser = input; return input; } };
  await withEnvironment({ NODE_ENV: 'development', PTW_DEMO_ADMIN_ENABLED: 'true' }, async () => {
    const response = await withServer(store, (baseUrl) => fetch(`${baseUrl}/api/admin/users`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        userId: 'U001',
        fullName: 'Test User',
        email: 'TEST@example.invalid',
        entraObjectId: '00000000-0000-4000-8000-000000000001',
        roleCode: 'PERMIT_REQUESTER',
        plantId: '1000',
        status: 'Active',
      }),
    }));
    assert.equal(response.status, 201);
    assert.equal(savedUser.email, 'test@example.invalid');
    assert.equal(savedUser.entraObjectId, '00000000-0000-4000-8000-000000000001');
  });
});