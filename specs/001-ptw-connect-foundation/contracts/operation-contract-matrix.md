# PTW Connect State-Changing Operation Contract Matrix

**Status**: Phase 1 design contract; no endpoint is implemented
**Base path**: `/api/v1`
**Related contracts**: [api-outline.md](./api-outline.md), [authorization-contract.md](./authorization-contract.md), [audit-contract.md](./audit-contract.md), [integration-contract.md](./integration-contract.md)

## Common Contract Rules

Every operation below MUST:

- derive authenticated identity, role, plant/location scope, server timestamp, and
  current status from trusted server context;
- reject client-supplied actor, role, status, timestamp, risk outcome, authorization
  scope, or audit result;
- use `Idempotency-Key` for commands and `If-Match` or an equivalent version check for
  mutable resources;
- return `409 Conflict` for stale state/version or conflicting idempotency fingerprints;
- return an RFC 7807-compatible problem without secrets or protected data when denied;
- append the required workflow/audit event only after the command succeeds; and
- fail closed when configured safety rules, evidence, or authorization are missing.

Request DTOs below are illustrative contract names. Exact fields and validation limits
remain subject to API, HSE, operations, security, and customer identity review.

## Operation Matrix

| Operation | Request DTO and server-owned fields | Response DTO/status | Human actor and scope | State/evidence/SOD guard | Replay, concurrency, audit |
|---|---|---|---|---|---|
| `POST /permits` | `CreatePermitRequest`: type, plant, location, validity, scope, activities, personnel; server owns permit ID/number, requester, timestamps, status | `PermitResponse`; `201` | Authenticated Permit Requester; authorized plant/location | Configured permit type and plant scope; draft only; no safety approval implied | Idempotency + version 0; `PERMIT_CREATED` audit |
| `PATCH /permits/{permitId}` | `UpdateDraftPermitRequest`: editable draft fields and version; server owns actor/time/status/scope | `PermitResponse`; `200` | Requester or configured draft editor in permit scope | `DRAFT` only; required field validation; closed records immutable | Idempotency + `If-Match`; `PERMIT_DRAFT_UPDATED` audit |
| `POST /permits/{permitId}/submit` | `SubmitPermitRequest`: confirmation/comment if configured; no actor/status/time | `WorkflowCommandResponse`; `202` or `200` | Permit Requester or configured submitter in scope | Draft complete; permit type, risk prerequisites, and approver route configured | Idempotency + version; workflow history `DRAFT -> SUBMITTED` |
| `PUT /permits/{permitId}/risk-assessment` | `RiskAssessmentRequest`: hazards, controls, likelihood/severity, human confirmation data | `RiskAssessmentResponse`; `200` | Requester or configured assessor in scope | Matrix/version configured; mandatory hazards and controls present; no automatic safe decision | Idempotency + `If-Match`; `RISK_ASSESSMENT_SAVED` audit |
| `POST /permits/{permitId}/risk-assessment/confirm` | `ConfirmRiskAssessmentRequest`: explicit human confirmation and comment if required | `WorkflowCommandResponse`; `200` | Authorized requester/HSE reviewer in scope | Assessment complete and human-confirmed; threshold routing applied by configuration | Idempotency + version; `RISK_CONFIRMED` audit/history |
| `POST /permits/{permitId}/isolations` | `RecordIsolationRequest`: type, points, tag/lock, performer, evidence reference | `IsolationResponse`; `201` | Configured Electrical/Mechanical/Process/Instrument Isolation Authority in scope | Isolation type and points configured; performer authorized; no client status | Idempotency + version; `ISOLATION_RECORDED` audit |
| `POST /permits/{permitId}/isolations/{isolationId}/verify` | `VerifyIsolationRequest`: verification result, evidence, comment | `IsolationResponse`; `200` | Independent configured verifier in same permitted scope | Correct point register; independent verifier when configured; evidence valid | Idempotency + `If-Match`; `ISOLATION_VERIFIED` history |
| `POST /permits/{permitId}/gas-tests` | `RecordGasTestRequest`: test type/location, readings, unit, instrument, calibration, test time | `GasTestResponse`; `201` | Authorized Gas Tester in scope | Configured limits and calibration; readings retained; no missing limit passes | Idempotency + version; `GAS_TEST_RECORDED` audit |
| `POST /permits/{permitId}/gas-tests/{gasTestId}/acknowledge` | `AcknowledgeGasTestRequest`: explicit tester acknowledgment/comment | `GasTestResponse`; `200` | Authorized Gas Tester in scope | Current test, valid calibration, configured rule, authorized tester | Idempotency + `If-Match`; `GAS_TEST_ACKNOWLEDGED` history |
| `POST /permits/{permitId}/toolbox-talks` | `RecordToolboxTalkRequest`: hazards/controls presented, attendees, issuer/receiver acknowledgments | `ToolboxTalkResponse`; `201` | Permit Issuer and Permit Receiver, each authenticated in scope | Required attendees and acknowledgments; configured SOD; no activation implied | Idempotency + version; `TOOLBOX_TALK_RECORDED` audit |
| `POST /permits/{permitId}/attachments` | `CreateAttachmentRequest`: category, content metadata, storage reference/token from approved upload flow | `AttachmentResponse`; `201` | Authenticated permitted user in scope | Allow-listed type/size/signature, malware status, safe filename/reference | Idempotency + version; `ATTACHMENT_ADDED` and access audit |
| `POST /permits/{permitId}/workflow/approve` | `ApproveTaskRequest`: task ID, comment if configured; actor/status/time server-owned | `WorkflowCommandResponse`; `200` | Assigned configured Approver in plant/location scope | `APPROVAL_PENDING`, task assigned, evidence complete, SOD/self-approval rules pass | Idempotency + version; `APPROVED` or next-step history/audit |
| `POST /permits/{permitId}/workflow/reject` | `RejectTaskRequest`: task ID and mandatory reason | `WorkflowCommandResponse`; `200` | Assigned configured Approver/HSE reviewer in scope | Valid task/state; non-empty reason; SOD | Idempotency + version; `REJECTED` history/audit |
| `POST /permits/{permitId}/workflow/return` | `ReturnTaskRequest`: task ID and mandatory correction reason | `WorkflowCommandResponse`; `200` | Assigned configured reviewer/approver in scope | Valid task/state; non-empty reason; SOD | Idempotency + version; return history/audit |
| `POST /permits/{permitId}/workflow/request-information` | `RequestInformationCommand`: task ID, questions, comment | `WorkflowCommandResponse`; `200` | Assigned configured reviewer/approver in scope | Valid task/state; comment required; no state bypass | Idempotency + version; `INFORMATION_REQUESTED` audit |
| `POST /permits/{permitId}/workflow/delegate` | `DelegateTaskRequest`: task ID, substitute user, interval, reason | `WorkflowCommandResponse`; `200` | Authorized task owner/approver in scope | Active delegation, substitute role/scope, interval, SOD, no expired delegation | Idempotency + version; `DELEGATED` audit/history |
| `POST /permits/{permitId}/issue` | `IssuePermitRequest`: issue confirmation and comment if configured | `WorkflowCommandResponse`; `200` | Permit Issuer authorized for plant/location | `APPROVED`, valid dates, unresolved blockers absent; issue is not activation | Idempotency + version; `APPROVED -> ISSUED` history |
| `POST /permits/{permitId}/activate` | `ActivatePermitRequest`: issuer/receiver acknowledgments, toolbox-talk reference, explicit confirmation | `WorkflowCommandResponse`; `200` | Permit Issuer and Permit Receiver authenticated and authorized | `ISSUED`; risk, isolation, gas, toolbox talk, validity, and configured evidence complete; SOD | Idempotency + version; `ISSUED -> ACTIVE` history/audit |
| `POST /permits/{permitId}/suspend` | `SuspendPermitRequest`: mandatory reason, conditions, evidence reference | `WorkflowCommandResponse`; `200` | Configured Operations Representative/Site Controller in scope | `ACTIVE`; reason required; current version; human decision | Idempotency + version; `ACTIVE -> SUSPENDED` history/audit |
| `POST /permits/{permitId}/resume` | `ResumePermitRequest`: resolved conditions, checks, comment | `WorkflowCommandResponse`; `200` | Configured authorized operations role in scope | `SUSPENDED`; required revalidation/reapproval complete; no unresolved blocker | Idempotency + version; resume history/audit |
| `POST /permits/{permitId}/extensions` | `RequestExtensionRequest`: proposed dates, changed scope/conditions/personnel, reason | `ExtensionResponse`; `202` or `200` | Authorized requester/operations role in scope | Before expiry; reassessment and reapproval rules selected from configuration | Idempotency + version; extension request/audit |
| `POST /permits/{permitId}/handback` | `HandbackRequest`: completion, housekeeping, personnel/tools removal, comments | `WorkflowCommandResponse`; `200` | Permit Receiver authorized in scope | `ACTIVE`; all handback confirmations; no automatic closure | Idempotency + version; `ACTIVE -> HANDBACK_PENDING` history |
| `POST /permits/{permitId}/close` | `ClosePermitRequest`: verification, de-isolation, closure confirmations, reason | `WorkflowCommandResponse`; `200` | Configured Site Controller/authorized closer in scope | Handback complete; de-isolation authorized; closure evidence and SOD | Idempotency + version; `CLOSURE_PENDING -> CLOSED` history/audit |
| `POST /permits/{permitId}/cancel` | `CancelPermitRequest`: mandatory reason | `WorkflowCommandResponse`; `200` | Configured authorized role in scope | Eligible non-active state; reason; no client-forced terminal status | Idempotency + version; cancellation history/audit |
| `POST /permits/from-maintenance-order/{orderNumber}` | `CreatePermitFromOrderRequest`: SAP system reference, selected mapping, permit draft fields | `PermitResponse` plus provenance; `201` or `202` | Authenticated requester in permitted plant/location | SAP mapping configured; only allowed copy-on-create fields; PTW fields protected | Idempotency + correlation; `PERMIT_CREATED_FROM_SAP` audit |
| `POST /permits/{permitId}/sync-sap` | `SyncSapRequest`: approved SAP system reference and mapping version | `SyncAcceptedResponse`; `202` | Authorized permitted user/operator | Explicit sync; mapping valid; no PTW-controlled field overwrite | Idempotency + correlation; sync event/audit |
| `POST /integration/sap/callback` | `SapCallbackRequest`: signed/validated event envelope and mapped payload reference | `CallbackAcceptedResponse`; `202` | Approved integration identity, not browser user | Signature/replay/authentication/mapping validation; no unsafe mutation | Callback idempotency + correlation; integration audit |
| `POST /integration/notifications/{notificationId}/reprocess` | `ReprocessNotificationRequest`: reason and optional retry policy | `NotificationResponse`; `202` | Authorized integration operator in permitted scope | Dead-letter/retryable notification; no workflow rollback | Idempotency + correlation; reprocess audit |
| `POST /shift-handovers` | `CreateShiftHandoverRequest`: shift, incoming/outgoing controllers, scoped permit items | `ShiftHandoverResponse`; `201` | Authorized outgoing/incoming controller in plant scope | Active/suspended permits only; all scope and acceptance rules configured | Idempotency + version; handover audit |
| `POST /shift-handovers/{id}/items/{itemId}/acknowledge` | `AcknowledgeHandoverItemRequest`: accepted flag and mandatory reason when rejected | `HandoverItemResponse`; `200` | Authorized incoming controller in plant/location scope | Handover item current; acceptance or reason; no hidden permits | Idempotency + version; handover history/audit |

## Required Contract Review Evidence

The reviewer must verify that each row has a request DTO, response/status, human actor,
plant/location scope, current-state guard, evidence, SOD rule, replay/concurrency rule,
and audit outcome. Any row that cannot name a site-specific value must identify the
configuration source and validation owner rather than inventing a default.
