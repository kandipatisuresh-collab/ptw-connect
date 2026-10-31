# Permit API Contract

This contract describes the externally observable resource and command behavior. Exact route
serialization and authentication claims are finalized during implementation and OpenAPI review.

## Resource Operations

- `POST /api/permits`: create a draft permit; returns permit identity, status, version, and audit
  correlation ID.
- `GET /api/permits/{permitId}`: return an authorized permit view with current status, validity,
  safety summary, responsibilities, references, and outstanding gates.
- `PUT /api/permits/{permitId}`: update editable draft or review data subject to role and version
  checks; must reject stale writes.
- `GET /api/permits`: search with authorized filters, sorting, and pagination.
- `GET /api/permits/{permitId}/audit`: return an authorized immutable audit history.
- `GET /api/permits/{permitId}/workflow`: return current tasks, decisions, prerequisites, and
  outstanding assignments.

## Lifecycle Commands

- `POST /api/permits/{permitId}/submit`
- `POST /api/permits/{permitId}/approve`
- `POST /api/permits/{permitId}/reject`
- `POST /api/permits/{permitId}/issue`
- `POST /api/permits/{permitId}/suspend`
- `POST /api/permits/{permitId}/resume`
- `POST /api/permits/{permitId}/extend`
- `POST /api/permits/{permitId}/close`

Every command must authenticate the actor, evaluate plant or area scope, validate the current
state and prerequisites, apply concurrency protection, write status history and audit evidence,
and return the resulting status or a safe error.

## Supporting Resource Groups

- Risk assessments, checklist responses, gas tests, isolations, approvals, attachments, and
  notifications are scoped to a permit and inherit its authorization boundary.
- Dashboard and report queries must apply the caller's scope before filters and exports.
- QR verification must return only the minimum authorized fields and must not become an anonymous
  bypass for confidential permit information.

## Error Contract

```json
{
  "errorCode": "PTW_INVALID_TRANSITION",
  "message": "The permit cannot be issued until required isolations are verified.",
  "correlationId": "correlation-id",
  "timestamp": "2026-09-20T12:00:00Z",
  "details": {
    "blockedBy": ["isolation-identifier"]
  }
}
```

Messages are safe for end users. Stack traces, tokens, passwords, and internal connection details
must never be returned.

## Concurrency and Idempotency

State-changing commands must require a current resource version or equivalent precondition. Repeating
the same command with the same idempotency key must not duplicate the action or notification.
Conflicts return a safe error and leave the winning state unchanged.
