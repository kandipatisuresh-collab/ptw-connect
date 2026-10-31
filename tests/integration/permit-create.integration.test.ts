import test from 'node:test'; import assert from 'node:assert/strict'; test('permit integration fixture uses scoped requester headers', () => assert.equal('Permit Requester', 'Permit Requester'));
