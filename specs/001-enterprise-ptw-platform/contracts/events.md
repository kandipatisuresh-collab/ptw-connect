# Domain and Integration Event Contract

Events are correlated, versioned, and sanitized. They are emitted after the corresponding durable
state change succeeds.

## Permit Events

- `PermitCreated`
- `PermitSubmitted`
- `PermitApprovalRequired`
- `PermitApproved`
- `PermitRejected`
- `PermitIssued`
- `PermitActivated`
- `PermitSuspended`
- `PermitResumed`
- `PermitExtended`
- `PermitExpired`
- `PermitClosureRequired`
- `PermitClosed`
- `PermitCancelled`

Common event fields: event ID, event type, schema version, permit ID, permit number, occurred-at
time, actor or system source, correlation ID, resulting status, and minimal non-confidential data.

## Integration Events

- `MaintenanceReferenceLinked`
- `MaintenanceSyncRequested`
- `MaintenanceSyncSucceeded`
- `MaintenanceSyncFailed`
- `OutboundPermitUpdateRequested`
- `OutboundPermitUpdateSucceeded`
- `OutboundPermitUpdateFailed`

Integration events must not contain credentials, access tokens, or unnecessary sensitive permit
content. Consumers must tolerate duplicate delivery by using the event ID and correlation ID.
