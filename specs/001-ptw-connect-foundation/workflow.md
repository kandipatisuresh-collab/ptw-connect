# PTW Connect Permit Workflow Design

**Status**: Phase 1 workflow contract; transition enforcement is deferred to later phases

**Related artifacts**: [data-model.md](./data-model.md),
[authorization-contract.md](./contracts/authorization-contract.md), and
[hse-validation-checklist.md](./hse-validation-checklist.md)

## State Vocabulary

The initial PRD vocabulary contains 17 states:

`DRAFT`, `SUBMITTED`, `RISK_REVIEW`, `ISOLATION_PENDING`, `GAS_TEST_PENDING`,
`APPROVAL_PENDING`, `APPROVED`, `ISSUED`, `ACTIVE`, `SUSPENDED`, `EXTENSION_PENDING`,
`HANDBACK_PENDING`, `CLOSURE_PENDING`, `CLOSED`, `REJECTED`, `CANCELLED`, `EXPIRED`.

State names are the initial contract vocabulary. Routing, required roles, evidence,
comments, delegation, escalation, and site-specific transitions are configuration.

## Transition Design

| Transition category | Example movement | Human actor | Required guard/evidence | History |
|---|---|---|---|---|
| Draft submission | `DRAFT -> SUBMITTED` | Permit Requester or configured submitter | Complete draft, configured permit type, authorized plant/location | Append `SUBMITTED` event |
| Risk review | `SUBMITTED -> RISK_REVIEW` | Configured reviewer/HSE role | Human risk assessment, hazards, controls, matrix version | Append review event |
| Safety readiness | `RISK_REVIEW -> ISOLATION_PENDING` or `GAS_TEST_PENDING` | Configured workflow owner | Required safety configuration and assigned tasks | Append routing event |
| Isolation verification | `ISOLATION_PENDING -> GAS_TEST_PENDING` or `APPROVAL_PENDING` | Authorized isolation performer and independent verifier | Point register, tags/locks, evidence, independent verification where configured | Append verification event |
| Gas-test readiness | `GAS_TEST_PENDING -> APPROVAL_PENDING` | Authorized Gas Tester | Current readings, calibration, configured limits, human acknowledgment | Append gas-test event |
| Approval | `APPROVAL_PENDING -> APPROVED` | Assigned configured Approver/HSE reviewer | Current task, evidence, SOD/self-approval, comment if required | Append approval event |
| Rejection/return | Review/approval state -> `REJECTED` or correction state | Assigned reviewer/approver | Non-empty rejection/return reason | Append outcome event |
| Issue | `APPROVED -> ISSUED` | Permit Issuer | Approved state, dates, no unresolved blockers | Append issue event |
| Activation | `ISSUED -> ACTIVE` | Permit Issuer and Permit Receiver | Toolbox talk, acknowledgments, isolation, gas test, validity, configured checks | Append activation event |
| Suspension | `ACTIVE -> SUSPENDED` | Configured operations authority | Current active state and mandatory reason | Append suspension event |
| Resumption | `SUSPENDED -> ACTIVE` or configured review state | Configured operations authority | Suspension resolved, required validation/reapproval | Append resume event |
| Extension | `ACTIVE -> EXTENSION_PENDING` | Authorized requester/operations role | Before expiry, changed conditions/scope/personnel, reassessment rule | Append extension event |
| Handback | `ACTIVE -> HANDBACK_PENDING` | Permit Receiver | Work complete, housekeeping, personnel/tools removed | Append handback event |
| Closure review | `HANDBACK_PENDING -> CLOSURE_PENDING` | Configured verifier/controller | Handback and de-isolation evidence | Append closure-review event |
| Closure | `CLOSURE_PENDING -> CLOSED` | Authorized closer | Required confirmations, de-isolation, SOD | Append closure event |
| Cancellation | Eligible non-active state -> `CANCELLED` | Configured authorized human | Valid state and mandatory reason | Append cancellation event |
| Expiry | Eligible state -> `EXPIRED` | Explicit configured operational process | Server time, validity rule, audit; expiry alert is not approval | Append expiry event |

No transition is performed because a UI condition appears true. Every accepted or
rejected command is evaluated and recorded by the server. Every transition requires an
idempotency key and an optimistic-concurrency version check. A repeated command cannot
append a second transition, and a stale version cannot append any transition.

## Activation Gate

Approval is not activation. Activation is denied unless the server confirms all required
configuration and human evidence: valid dates, human risk confirmation, required isolation
verification, mandatory gas-test acknowledgment, toolbox-talk attendance and issuer/
receiver acknowledgment, authorization scope, current workflow state, and configured
segregation-of-duties rules.

## Closed-Permit Amendment

A `CLOSED` permit is immutable. A correction uses a separately authorized amendment
process that creates a new auditable record referencing the original; it never rewrites
closed values or deletes workflow/audit history.
