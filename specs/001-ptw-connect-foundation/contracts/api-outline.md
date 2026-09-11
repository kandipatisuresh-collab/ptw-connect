# PTW Connect API Contract Outline

**Status**: Phase 1 design outline; not an implemented API
**Base path**: `/api/v1`
**Operation detail**: [operation-contract-matrix.md](./operation-contract-matrix.md)

## Contract Rules

- All operations require authenticated identity unless explicitly marked as a health
  probe. Authorization is evaluated server-side using role plus plant/location scope.
- Requests and responses use purpose-built DTOs. Persistence entities are never exposed.
- State-changing commands require an `Idempotency-Key` and accept or propagate an
  `X-Correlation-ID`. Actor, timestamps, status, risk decisions, and scope are derived
  or validated server-side.
- Collection queries use allow-listed filters, sorting, and pagination and return only
  permitted plant/location data.
- Errors use RFC 7807-compatible problem responses without stack traces, tokens,
  credentials, or confidential SAP payload fields.
- A command must identify its required human role, current-state guard, mandatory
  evidence, SOD rule, conflict behavior, and audit outcome in its detailed contract.
- The complete per-operation contract is maintained in
  `operation-contract-matrix.md`; an endpoint is not considered specified merely
  because it appears in an inventory row below.

## Common Headers and Responses

### Request headers

| Header | Required | Meaning |
|---|---:|---|
| `Authorization` | Yes for protected operations | Validated bearer identity |
| `X-Correlation-ID` | Optional input, server-generated if absent | Trace across audit/integration records |
| `Idempotency-Key` | Required for state-changing commands | Replay and duplicate-command control |
| `If-Match` | Required where versioned resource is changed | Optimistic-concurrency version |

### Common response outcomes

- `200 OK`: Successful query or command with a response body.
- `201 Created`: New resource created by an explicit human command.
- `202 Accepted`: Asynchronous SAP or notification operation accepted for processing.
- `204 No Content`: Successful command without a response body.
- `400 Bad Request`: Malformed request or unsupported filter.
- `401 Unauthorized`: Missing or invalid authentication.
- `403 Forbidden`: Authenticated identity lacks role or plant/location authorization.
- `404 Not Found`: Resource is absent or not visible in the caller's permitted scope.
- `409 Conflict`: Invalid current state, stale version, duplicate conflict, or
  incompatible idempotency fingerprint.
- `422 Unprocessable Entity`: Valid syntax but missing or invalid business evidence.
- `429 Too Many Requests`: Rate limit exceeded.
- `500/502/503`: Sanitized server or dependency failure; no sensitive diagnostics.

### Problem response shape

```json
{
  "type": "https://ptw.example.invalid/problems/validation",
  "title": "Validation failed",
  "status": 422,
  "detail": "Required isolation verification is incomplete",
  "instance": "/api/v1/permits/{permitId}/activate",
  "correlationId": "uuid",
  "errors": [
    { "field": "isolationVerification", "code": "REQUIRED", "message": "..." }
  ]
}
```

The example hostname is illustrative only. Production problem types and URLs require
security and API governance approval.

## Endpoint Outline

### Health and operational visibility

| Method and path | Purpose | Notes |
|---|---|---|
| `GET /health/live` | Process liveness | Must not expose dependency secrets |
| `GET /health/ready` | Readiness status | Reports sanitized dependency state |
| `GET /metrics` | Authorized operational metrics | No personal or confidential payloads |

### Identity, authorization, and master data

| Method and path | Purpose |
|---|---|
| `GET /users/me` | Return the authenticated user's safe profile and effective scope |
| `GET /users/me/authorizations` | List effective role, plant, location, delegation, and expiry scope |
| `GET /master-data/permit-types` | List configured permit types visible to the caller |
| `GET /master-data/plants` | List plants and permitted location scope |
| `GET /master-data/hazards` | List configured hazard catalog entries |
| `GET /master-data/controls` | List configured control measures |
| `GET /master-data/risk-matrices` | List approved risk-matrix versions for permitted sites |

### Permits and safety evidence

| Method and path | Purpose | State-changing controls |
|---|---|---|
| `GET /permits` | Search permitted permits | Scoped filters, pagination, sorting |
| `POST /permits` | Create a manual draft | Authenticated requester; server assigns actor/time |
| `GET /permits/{permitId}` | Retrieve a safe permit DTO | Scope checked; no hidden data leakage |
| `PATCH /permits/{permitId}` | Update an editable draft | Version and scope checked; closed records immutable |
| `POST /permits/{permitId}/submit` | Submit draft for configured review | Mandatory data and idempotency |
| `GET /permits/{permitId}/risk-assessment` | Retrieve risk evidence | Scope and audit access checked |
| `PUT /permits/{permitId}/risk-assessment` | Save human risk assessment | Human confirmation; no autonomous safety result |
| `POST /permits/{permitId}/risk-assessment/confirm` | Confirm assessment for review | Authorized human; server timestamp and audit |
| `GET /permits/{permitId}/isolations` | Retrieve isolation plan/evidence | Scope checked |
| `POST /permits/{permitId}/isolations` | Record isolation action | Authorized isolation role; evidence and audit |
| `POST /permits/{permitId}/isolations/{isolationId}/verify` | Independent verification | Different authorized human where configured |
| `GET /permits/{permitId}/gas-tests` | Retrieve gas-test events/readings | Scope checked |
| `POST /permits/{permitId}/gas-tests` | Record gas test | Authorized gas tester; configured limits only |
| `POST /permits/{permitId}/gas-tests/{gasTestId}/acknowledge` | Human acknowledgment | Tester identity and calibration evidence |
| `POST /permits/{permitId}/toolbox-talks` | Record toolbox talk | Issuer/receiver and attendee evidence |
| `POST /permits/{permitId}/attachments` | Add validated attachment metadata/reference | Allow-list, size, scan state, audit |
| `GET /permits/{permitId}/attachments` | List permitted attachments | Attachment access audit |

### Workflow and lifecycle commands

| Method and path | Purpose | Required human boundary |
|---|---|---|
| `GET /permits/{permitId}/workflow` | Current task and state view | Scope checked |
| `GET /permits/{permitId}/workflow/history` | Complete action history | Append-only source; scope checked |
| `POST /permits/{permitId}/workflow/approve` | Approve assigned task | Approver role, SOD, state, evidence, idempotency |
| `POST /permits/{permitId}/workflow/reject` | Reject with reason | Assigned role and mandatory comment |
| `POST /permits/{permitId}/workflow/return` | Return for correction | Assigned role and mandatory comment |
| `POST /permits/{permitId}/workflow/request-information` | Request more information | Assigned role, comment, audit |
| `POST /permits/{permitId}/workflow/delegate` | Delegate assigned task | Valid delegation and authorization |
| `POST /permits/{permitId}/issue` | Issue approved permit | Permit Issuer; approval and evidence checked |
| `POST /permits/{permitId}/activate` | Activate issued permit | Issuer and receiver checks; no automatic activation |
| `POST /permits/{permitId}/suspend` | Suspend active permit | Authorized human and mandatory reason |
| `POST /permits/{permitId}/resume` | Resume suspended permit | Configured validation or approval |
| `POST /permits/{permitId}/extensions` | Request extension | Before expiry; reassessment rules |
| `POST /permits/{permitId}/handback` | Record receiver handback | Receiver, completion, housekeeping, personnel/tools |
| `POST /permits/{permitId}/close` | Close after verification | Authorized closer; de-isolation and evidence |
| `POST /permits/{permitId}/cancel` | Cancel a permitted non-active record | Authorized human and reason |

### SAP and integration monitoring

| Method and path | Purpose | Notes |
|---|---|---|
| `GET /sap/maintenance-orders` | Search proposed canonical orders | Backend-only SAP access; scoped filters |
| `GET /sap/maintenance-orders/{orderNumber}` | Retrieve one proposed order | Metadata mapping is configurable/unverified |
| `POST /permits/from-maintenance-order/{orderNumber}` | Create draft from mapped order | Explicit requester; PTW fields protected |
| `POST /permits/{permitId}/sync-sap` | Request explicit refresh | Returns correlation reference; no PTW overwrite |
| `GET /sap/sync-events/{correlationId}` | Retrieve sanitized sync status | Supports retry/dead-letter visibility |
| `POST /integration/sap/callback` | Receive approved integration callback | Authenticated integration identity and replay control |
| `GET /integration/notifications` | View notification delivery status | Authorized operational view |
| `POST /integration/notifications/{id}/reprocess` | Request manual reprocessing | Authorized operator and audit |

### Dashboards, reports, and audit

| Method and path | Purpose |
|---|---|
| `GET /dashboard/summary` | Counts for drafts, approvals, active/suspended/expiring work |
| `GET /dashboard/integration-failures` | SAP and notification failure counts |
| `GET /reports/permits.csv` | Authorized CSV export | Scope and export audit |
| `GET /reports/permits.pdf` | Authorized PDF export | Scope and export audit |
| `GET /audit-events` | Search permitted audit history | Immutable source, legal hold/retention controls |
| `GET /shift-handovers` | List active handovers in scope |
| `POST /shift-handovers` | Create human shift handover | Controller authorization and audit |
| `POST /shift-handovers/{id}/items/{itemId}/acknowledge` | Accept or reject transfer | Incoming controller action and reason |

## Contract Gaps Requiring Later Design

- Exact DTO fields and enum values require domain and API review.
- Authentication claims and Entra group/role mapping require identity-owner validation.
- Export authorization, pagination limits, and report retention require compliance review.
- SAP callback authentication and message signature require integration metadata.
- Health and metrics exposure require deployment and security review.
