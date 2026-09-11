# External Integration Contract Outline

**Status**: Phase 1 design contract; no external calls are implemented

## Integration Boundary

The browser communicates only with the secured PTW backend. The backend owns all calls
to SAP, identity validation, object storage, and notification providers. Credentials,
tokens, certificates, and confidential payloads never reach the browser or ordinary logs.

External behavior is accessed through ports and adapters:

- `MaintenanceOrderGateway`: reads proposed canonical maintenance-order data.
- `NotificationGateway`: queues approval, reminder, escalation, rejection, suspension,
  expiry, and closure notifications.
- Attachment storage and malware scanning: validates and stores metadata/reference;
  binary content remains outside MySQL.

Adapter implementations, credentials, destination metadata, and customer connectivity
are deferred to the phases named in the PRD.

## MaintenanceOrderGateway Contract

### Read operation

`fetchMaintenanceOrder(systemReference, orderReference, queryContext)` returns either:

- a proposed `MaintenanceOrder` DTO with source system, mapping version, retrieved UTC
  time, and sanitized provenance; or
- a typed, sanitized failure with category, retryability, correlation ID, and no secret or
  confidential payload.

The proposed fields are:

- `sapSystemId`, `orderNumber`, `orderType`, `shortText`, `longText`;
- `plant`, `planningPlant`, `maintenancePlant`, `mainWorkCenter`;
- `functionalLocation`, `equipmentNumber`, `priority`;
- `systemStatus`, `userStatus`;
- `basicStartDate`, `basicFinishDate`, `scheduledStartDate`, `scheduledFinishDate`;
- `plannerGroup`, `responsiblePerson`, `operationNumber`, `operationDescription`.

These are proposed canonical names only. Customer metadata must validate names, types,
entity paths, status semantics, and availability before implementation is accepted.

### Mapping and synchronization rules

- Mappings are allow-listed and versioned per approved SAP system/site configuration.
- Creation from an order copies only fields marked `copy_on_creation`.
- Refresh updates only fields marked `sync_on_refresh`.
- PTW-controlled status, approvals, risk decisions, isolation, gas-test, toolbox-talk,
  handback, closure, and audit fields are never overwritten by SAP.
- A successful sync records last-success time and mapping version.
- A failed or stale sync leaves the PTW permit data intact, marks the reference stale,
  and creates a sanitized integration event.
- Manual permit creation remains available when SAP is unavailable; SAP failure must not
  lose an already saved PTW draft.

### SAP endpoint outline

| Operation | Contract behavior |
|---|---|
| Search orders | Scoped query with allow-listed filters, encoded values, pagination, timeout, and correlation ID |
| Get order | One proposed canonical DTO or sanitized not-found/integration problem |
| Create from order | Explicit requester command; returns draft reference and sync provenance |
| Refresh order | Explicit command; returns `202 Accepted` and correlation reference when asynchronous |
| Callback | Authenticated integration callback with replay protection and mapping validation |
| Sync status | Sanitized event state, retries, stale marker, and manual-reprocess state |

Required configurable placeholders include SAP base URL, service/entity set, token URL,
client/scopes, certificate alias, communication arrangement, Integration Suite endpoint,
field mapping version, timeout, retry, circuit-breaker, and dead-letter policy. Placeholder
or incomplete configuration fails closed; it is never treated as a working destination.

## NotificationGateway Contract

A notification request contains event type, permitted recipient reference, template/version,
correlation ID, safe permit reference, and delivery deadline. It does not contain tokens,
credentials, or unnecessary confidential payload.

- Workflow transaction commits independently of notification delivery.
- The outbox records intent before delivery is attempted.
- Retryable failures use bounded retry with backoff and jitter.
- Permanent failures move to a dead-letter/manual-reprocessing state and remain visible to
  authorized operators.
- Delivery, retry, failure, and reprocessing outcomes are auditable.
- Recipient resolution is server-side and must respect plant/location scope and privacy.

## Failure Categories

| Category | Default behavior |
|---|---|
| Authentication/configuration | Fail closed; do not retry blindly; alert authorized operator |
| Timeout/transient dependency | Retry within policy; preserve PTW transaction; expose correlation ID |
| Rate limit | Back off and retry within policy; record throttling |
| Malformed external data | Reject mapping; preserve existing data; dead-letter for review |
| Circuit open/unavailable | Do not call dependency; show stale/degraded status |
| Callback replay/invalid signature | Reject and audit security event; do not mutate permit |
| Mapping conflict | Require manual review; never overwrite PTW-controlled fields |

## Validation Dependencies

Actual SAP connectivity, metadata, authentication, mapping, status semantics, and
Integration Suite behavior require customer validation before Phase 7 completion. No
adapter compilation or mock response can substitute for that evidence.
