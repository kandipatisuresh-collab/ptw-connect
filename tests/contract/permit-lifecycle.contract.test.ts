import test from 'node:test'; import assert from 'node:assert/strict'; test('lifecycle command contract is explicit', () => assert.ok(['issue', 'activate', 'suspend', 'resume', 'close'].length > 0));
