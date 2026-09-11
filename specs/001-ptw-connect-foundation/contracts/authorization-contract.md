# Authorization and Safety Transition Contract

**Status**: Phase 1 design contract; enforcement is deferred to implementation phases

**Related artifacts**: [workflow.md](../workflow.md), [data-model.md](../data-model.md),
and [hse-validation-checklist.md](../hse-validation-checklist.md)

## Authority Model

The backend is the authorization boundary. A request is permitted only when all
applicable checks pass:

1. The authentication token is valid and not expired.
2. The authenticated subject maps to an active PTW user.
3. The user has the required configured role for the operation.
4. The user is authorized for the permit's plant and location at the server-resolved
   effective time.
5. The permit/workflow is in the expected current state and version.
6. Mandatory data and safety evidence are present, valid, current, and recorded by an
   authorized role.
7. Configured segregation-of-duties and self-approval rules pass.
8. The idempotency key is new or matches the exact prior request fingerprint.
9. The command is recorded with a server-generated timestamp, correlation ID, actor
   context, outcome, and audit/workflow history.

Failure of any required check denies the command. The client cannot override any check.

## Scope Rules

- A caller may read or change only records within active plant/location authorization.
- Authorization is additive and explicit; absence of a matching grant is denial.
- Delegation is valid only during its configured interval, for its configured role and
  scope, and when the substitute is active and authorized.
- Administrative access does not automatically grant operational safety authority;
  roles and scope remain explicit.
- Exports, attachment access, audit search, and integration monitoring use the same
  scope checks as ordinary queries.

## Safety-Critical Transition Matrix

| Transition category | Required human boundary | Mandatory checks | Denial examples |
|---|---|---|---|
| Submit | Requester | Draft completeness, scope, configured permit type, risk prerequisites | Missing mandatory data or unauthorized plant |
| Risk confirmation | Requester or configured reviewer | Human confirmation, matrix version, hazards and controls | Missing controls or absent matrix |
| Isolation verification | Independent authorized verifier | Correct isolation points, performer/verifier separation when configured, evidence | Self-verification or incomplete point register |
| Gas acknowledgment | Authorized gas tester | Instrument/calibration, configured limits, location, test recency | Missing limits, expired calibration, out-of-range reading |
| Approve | Assigned approver | Current task, route, SOD, comments for rejection/return | Requester self-approval or stale task |
| Issue | Permit Issuer | Approved state, valid dates, unresolved blockers absent | Attempt from `DRAFT` or `APPROVAL_PENDING` |
| Activate | Permit Issuer and Permit Receiver | Toolbox talk, acknowledgments, isolation, gas, dates, current version | Approval treated as activation or missing evidence |
| Suspend | Authorized operations role | Active state, reason, current version, audit | Missing reason or invalid state |
| Resume | Configured authorized human | Suspension reason resolved, new checks/reapproval if configured | Unresolved safety condition |
| Extend | Requester/authorized role | Before expiry, changed scope/conditions/personnel, reassessment and reapproval rules | Expired request or missing reassessment |
| Handback | Permit Receiver | Work completion, housekeeping, personnel/tools removed | Incomplete handback evidence |
| Close | Authorized closer | Handback, de-isolation, closure confirmations, SOD | Direct close from active or closed mutation |
| Cancel/expire | Authorized human or explicit operational process | Eligible state, reason, server time, audit | Silent or client-forced status change |

These are contract categories. Site-specific role names and routing are configurable and
must be validated by HSE and operations before implementation.

## Conflict and Replay Behavior

- A stale version returns `409 Conflict`; no state or history changes are committed.
- A duplicate idempotency key with the same fingerprint returns the original outcome
  without a second transition or notification.
- A duplicate key with a different fingerprint returns `409 Conflict`.
- A command for an invalid current state returns `409 Conflict` with a safe problem body.
- A denied command records an auditable outcome where the security event policy requires
  it, without revealing protected data to an unauthorized caller.

## Required Evidence Record

Every accepted state-changing action records:

- action and outcome;
- old and new state;
- permit/workflow identifier;
- authenticated identity and resolved user identifier;
- role and plant/location scope at action time;
- server UTC timestamp;
- reason or comment when required;
- source IP or approved source address representation;
- correlation ID and idempotency key;
- current version and resulting version;
- references to mandatory evidence used by the guard.

The record is append-only. Closed permit data is immutable except through a controlled
amendment process that creates new evidence rather than rewriting history.
