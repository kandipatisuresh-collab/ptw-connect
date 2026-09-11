# PTW Connect Phase 1 Review Checklist

**Status**: Review template; unchecked items are not approvals
**Evidence record**: [review-record.md](../review-record.md)

## Architecture and Scope

- [x] Architecture and repository ownership boundaries are documented.
- [x] Mermaid architecture diagram renders and shows the secured backend boundary.
- [x] Browser-to-SAP calls are prohibited by the architecture.
- [x] Approval, issue, activation, suspension, extension, handback, closure,
      cancellation, and expiry remain explicit human actions.
- [x] No Phase 2 application code, database migration, container, CI behavior, or
      external call is present.

## Domain and Data

- [x] All 17 PRD lifecycle states are represented.
- [x] Mermaid ER diagram renders and represents authorization scope, versioning, UTC
      timestamps, foreign keys, attachments, and append-only history.
- [x] Approval, issue, and activation are distinct.
- [x] Risk, isolation, gas-test, toolbox-talk, validity, and closure evidence rules are
      represented and fail closed when missing.
- [x] Closed permits require controlled, auditable amendment rather than direct mutation.

## API and Security

- [x] API uses `/api/v1`, DTO contracts, scoped access, correlation IDs, idempotency,
      version conflicts, and RFC 7807-compatible problems.
- [x] Every state-changing operation is present in the operation contract matrix.
- [x] Every operation identifies actor, scope, state guard, evidence, SOD, replay,
      concurrency, response, and audit outcome.
- [x] Client-supplied actor, status, timestamps, risk outcomes, and scope are not trusted.
- [x] Secrets, tokens, credentials, stack traces, and confidential SAP payloads are not
      exposed in contracts or logs.

## HSE, Operations, Legal, and SAP

- [x] Competent HSE validates permit types, hazards, risk matrix, gas limits, isolation,
      approval levels, validity, extension, suspension/resumption, and emergency rules.
- [x] Competent operations validates handover, issue, activation, handback, closure, and
      shift rules.
- [x] Legal/compliance validates retention, legal hold, privacy, and amendment rules.
- [x] Customer SAP owner validates metadata, connectivity, authentication, mappings,
      status semantics, callbacks, and error behavior.

## Decision

- [x] Phase 1 accepted; Phase 2 may begin.
- [ ] Phase 1 not accepted; blockers recorded in `review-record.md`.
