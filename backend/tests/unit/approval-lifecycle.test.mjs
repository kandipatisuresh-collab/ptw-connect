import test from 'node:test';
import assert from 'node:assert/strict';
import { decideApproval } from '../../dist/domain/approval/approval.js';
import { transitionIsolation } from '../../dist/domain/isolation/isolation.js';

test('requires the configured approval role and comments', () => {
  const approval = { id: 'a-1', permitId: 'p-1', requiredRole: 'Safety Officer' };
  assert.throws(() => decideApproval(approval, 'u-1', ['Permit Requester'], 'APPROVE', 'ok'), /required approval role/);
  const decided = decideApproval(approval, 'u-1', ['Safety Officer'], 'APPROVE', 'Controls verified');
  assert.equal(decided.decision, 'APPROVE');
  assert.equal(decided.approverId, 'u-1');
});

test('allows only sequential isolation controls', () => {
  let isolation = { id: 'i-1', permitId: 'p-1', type: 'Electrical', point: 'MCC-1', status: 'REQUESTED' };
  isolation = transitionIsolation(isolation, 'PLANNED');
  isolation = transitionIsolation(isolation, 'APPLIED');
  isolation = transitionIsolation(isolation, 'VERIFIED');
  assert.equal(isolation.status, 'VERIFIED');
});
