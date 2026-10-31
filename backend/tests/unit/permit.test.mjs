import test from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryPermitRepository } from '../../dist/infrastructure/database/permit-repository.js';
import { PermitCommandService } from '../../dist/application/permits/permit-command-service.js';

const actor = {
  userId: 'user-1',
  roles: ['Permit Requester'],
  plantIds: ['plant-1'],
  areaIds: ['area-1'],
  correlationId: 'test-correlation',
};

const input = {
  permitTypeId: 'hot-work',
  title: 'Pump repair',
  workDescription: 'Replace mechanical seal',
  plantId: 'plant-1',
  areaId: 'area-1',
  plannedStart: '2026-09-21T08:00:00Z',
  plannedEnd: '2026-09-21T16:00:00Z',
};

test('creates and submits a permit with audit history', () => {
  const repository = new InMemoryPermitRepository();
  const service = new PermitCommandService(repository);
  const permit = service.create(input, actor);
  assert.equal(permit.status, 'DRAFT');
  const submitted = service.submit(permit.id, actor);
  assert.equal(submitted.status, 'SUBMITTED');
  assert.equal(submitted.audit.length, 1);
  assert.equal(submitted.audit[0].action, 'Permit Submitted');
});

test('rejects a permit outside actor scope', () => {
  const repository = new InMemoryPermitRepository();
  const service = new PermitCommandService(repository);
  assert.throws(() => service.create({ ...input, plantId: 'other-plant' }, actor), /outside the permit/);
});
