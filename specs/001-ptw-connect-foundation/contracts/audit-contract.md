# Audit and History Contract

**Status**: Phase 1 design contract; persistence behavior is deferred to implementation

## History Classes

### Workflow history

Every accepted, rejected, returned, delegated, requested-information, suspended,
extended, handed-back, issued, activated, resumed, cancelled, expired, or closed
workflow command produces an append-only workflow history record. The record includes:

- event UUID and sequence number;
- permit and workflow instance references;
- old state and new state;
- action type and outcome;
- authenticated identity and resolved user reference;
- role and plant/location authorization snapshot;
- server UTC timestamp;
- required comment/reason;
- source address representation;
- correlation ID and idempotency key;
- prior and resulting optimistic version;
- references to mandatory evidence used for the transition.

A rejected command may also create a security/access event according to the audit policy;
it must not reveal protected data to the caller.

### Audit events

Audit events cover login and access, before/after controlled changes, attachment access,
SAP synchronization, notification delivery, configuration changes, exports, manual
reprocessing, legal hold, and retention operations. Before/after values are minimized,
classified, redacted where needed, and never contain tokens, credentials, or unnecessary
confidential payload.

## Immutability and Retention

- Workflow history and audit events are append-only and never hard-deleted.
- Database permissions and restrictive foreign keys must prevent ordinary update/delete.
- Legal hold prevents retention processing for protected records.
- Retention duration remains configurable and requires legal/compliance approval; Phase 1
  does not select a universal legal period.
- Any controlled correction to a closed permit creates an auditable amendment chain and
  never rewrites the original record.
- Tamper-evident implementation options, such as chained event digests and restricted
  archival storage, require security and operations design before production.

## Query Contract

Authorized audit consumers can filter by time, event class, actor, plant/location,
resource, correlation ID, outcome, and legal-hold state. Results are paginated and
scoped. Audit exports are themselves auditable events.

## Redaction Rules

Audit output must exclude or redact:

- access tokens, refresh tokens, passwords, private keys, and certificates;
- full SAP confidential payloads unless explicitly approved and classified;
- malware-scanner internals and storage credentials;
- data outside the caller's permitted plant/location scope.

## Evidence Review

The Phase 1 review must confirm that the API outline, data model, authorization contract,
and integration contract all reference the same actor, timestamp, old/new state,
comment, source address, correlation ID, idempotency, and append-only requirements.
