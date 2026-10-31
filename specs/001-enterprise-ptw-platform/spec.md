# Feature Specification: Enterprise Permit to Work Platform

**Feature Branch**: `001-enterprise-ptw-platform`

**Created**: 2026-09-20

**Status**: Draft

**Input**: User description: Build an enterprise Permit to Work application for industrial and oil and gas operations with configurable safety workflows, auditability, mobile field use, and SAP Plant Maintenance integration.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and submit a permit (Priority: P1)

A Permit Requester creates a permit for planned work, identifies the location and equipment,
references a maintenance activity when available, describes the work, records the work crew,
and submits the permit for review.

**Why this priority**: A reliable permit request is the entry point for every controlled work
activity and replaces incomplete or paper-based requests.

**Independent Test**: Create a permit with required work details, save it as a draft, complete
its mandatory information, and submit it. The submitted permit must be visible to assigned
reviewers and must retain its audit history.

**Acceptance Scenarios**:

1. **Given** an authorized requester and a new permit, **When** the requester enters the work
   description, permit type, location, equipment, planned dates, work organization, and crew
   details, **Then** the system saves the permit as a draft and identifies missing required data.
2. **Given** a draft with all required information and applicable safety data complete, **When**
   the requester submits it, **Then** the status changes to SUBMITTED, an audit entry is
   created, and the configured review process is started.
3. **Given** a requester without permission to create permits for a plant, **When** the requester
   attempts to submit work for that plant, **Then** the action is rejected without exposing
   unauthorized operational data.

---

### User Story 2 - Assess risk and safety controls (Priority: P1)

A safety reviewer evaluates hazards, likelihood, severity, controls, PPE, checklists, and gas
testing requirements before work can proceed.

**Why this priority**: The platform must prevent work from being approved when known hazards
are not assessed or required controls are incomplete.

**Independent Test**: Add hazards and controls, calculate initial and residual risk, complete a
permit-specific checklist, and record gas-test results for an applicable permit. Verify that
high or critical residual risk requires the configured additional approval.

**Acceptance Scenarios**:

1. **Given** a permit with a listed hazard, **When** the reviewer records likelihood and
   severity, **Then** the system calculates the risk score and category using the active matrix.
2. **Given** a hot-work permit with mandatory checklist items, **When** one mandatory item is
   unanswered or answered negatively without an accepted control, **Then** submission or
   approval is blocked and the incomplete item is identified.
3. **Given** a permit that requires gas testing, **When** a reading exceeds its configured
   threshold, **Then** the system warns the responsible users and prevents approval until the
   configured disposition is recorded.
4. **Given** a permit with high or critical residual risk, **When** the normal approval chain is
   evaluated, **Then** the configured additional approval step is required before issue.

---

### User Story 3 - Manage isolations and approvals (Priority: P1)

An Isolation Authority records, verifies, and releases required isolations while designated
reviewers approve the permit according to the work, location, risk, and isolation requirements.

**Why this priority**: Controlled isolation and independent approval are essential safeguards
for hazardous work and must be visible to the people responsible for them.

**Independent Test**: Create isolation requirements, progress them through their permitted
states, complete the configured approval chain, and verify that issue is unavailable until all
required safeguards are satisfied.

**Acceptance Scenarios**:

1. **Given** a permit requiring an electrical isolation, **When** the Isolation Authority records
   the isolation point, lock or tag, application, and verification, **Then** the isolation status
   progresses only through valid states and the responsible users can see its current state.
2. **Given** a required isolation that is not verified, **When** an issuer attempts to issue the
   permit, **Then** issue is rejected with the outstanding isolation clearly identified.
3. **Given** a configured approval chain, **When** an approver approves, rejects, or sends back a
   permit, **Then** the decision, comments, identity, time, and resulting workflow state are
   recorded and notifications are sent to the appropriate users.

---

### User Story 4 - Issue and control active work (Priority: P1)

A Permit Issuer issues an approved permit, and field users monitor, verify, suspend, resume,
extend, or close the work according to their permissions and site rules.

**Why this priority**: The primary operational value is safe control of work while it is being
performed, including rapid response when conditions change.

**Independent Test**: Take an approved permit through issue and activation, suspend it, resume
it after the required checks, and close it. Attempt invalid or unauthorized transitions and
verify that they are rejected and audited.

**Acceptance Scenarios**:

1. **Given** an approved permit with all required controls and isolations verified, **When** an
   authorized issuer issues it, **Then** it becomes ISSUED, records the issuer and issue time,
   and can be activated within its validity period.
2. **Given** an ACTIVE permit, **When** an authorized issuer suspends it, **Then** the permit
   becomes SUSPENDED, field users are notified, and further work is visibly marked as stopped.
3. **Given** a SUSPENDED permit, **When** the responsible authorities confirm the configured
   resume conditions, **Then** the permit becomes RESUMED or ACTIVE according to the configured
   workflow and records the decision.
4. **Given** an expired, cancelled, or closed permit, **When** a user attempts to issue, resume,
   or extend it without an allowed exception, **Then** the action is rejected and the reason is
   shown without changing the permit.
5. **Given** completed work and released isolations, **When** an authorized user closes the
   permit, **Then** closure details, actual end time, outstanding items, and final audit entries
   are recorded.

---

### User Story 5 - Monitor permits and respond in the field (Priority: P2)

An operations user views current permits, filters them by plant, area, type, risk, status,
contractor, equipment, or maintenance reference, and uses a mobile-friendly view to verify
permit status and perform assigned actions.

**Why this priority**: Supervisors and field personnel need timely visibility of work in their
area and cannot depend on office-only access.

**Independent Test**: Search and filter a representative permit set, open an active permit on a
small screen, scan its permit identifier, and complete an assigned checklist or field update.

**Acceptance Scenarios**:

1. **Given** permits across multiple plants and statuses, **When** an authorized operations user
   applies filters and sorting, **Then** only permitted records matching the criteria are shown
   with clear status, risk, validity, and location indicators.
2. **Given** an active permit, **When** a user scans its QR code, **Then** the verification view
   shows only the fields permitted for that user and never exposes confidential information
   without authentication.
3. **Given** a field user on a phone or tablet, **When** the user records an allowed checklist,
   gas test, isolation verification, photograph, suspension, resumption, or closure action,
   **Then** the action can be completed without horizontal scrolling and is auditable.

---

### User Story 6 - Integrate maintenance context and report compliance (Priority: P2)

A planner or permit requester finds relevant SAP Plant Maintenance notifications, orders,
operations, equipment, functional locations, and work centers, while administrators and
 auditors review permit activity, reports, and synchronization outcomes.

**Why this priority**: Linking permits to authoritative maintenance context reduces duplicate
entry and enables operational and compliance reporting.

**Independent Test**: Search for a maintenance order and notification, associate one with a
permit, view read-only maintenance context, and produce an audit or operational report without
requiring users to re-enter the source information.

**Acceptance Scenarios**:

1. **Given** an available maintenance reference, **When** a user searches by business identifier
   or description, **Then** matching authorized results are returned and the selected details are
   shown as read-only source context unless an explicit configuration permits editing.
2. **Given** an unavailable or temporarily failing maintenance service, **When** a user searches
   or synchronizes data, **Then** the permit workflow remains safe, the user receives a clear
   recoverable message, and the failure is recorded for reprocessing.
3. **Given** an auditor with read-only access, **When** the auditor requests permit history or a
   report, **Then** the result includes lifecycle decisions, approvals, safety controls,
   integrations, and relevant actors without allowing changes.

### Edge Cases

- A user loses connectivity while viewing assigned permits or recording a permitted field action;
  the action is queued only when it is safe to defer, is visibly marked as pending, and is not
  silently duplicated when connectivity returns.
- Two authorized users attempt conflicting lifecycle actions at nearly the same time; one action
  succeeds according to the configured concurrency rule and the other receives a clear conflict
  response without overwriting data.
- A permit references an archived, unavailable, or changed maintenance object; the existing
  reference remains auditable and the user is warned before proceeding.
- A permit reaches its end time while active, suspended, or awaiting closure; the system marks it
  expired according to configured rules and notifies responsible users.
- A required approver is unavailable or removed from the relevant role; an administrator can use
  an auditable delegation or reassignment rule without bypassing required approval levels.
- An uploaded attachment has an unsupported type, exceeds the configured limit, or fails malware
  scanning; it is rejected or quarantined and is not available for download.
- A gas reading is incomplete, uses an uncalibrated instrument, or exceeds a configured limit;
  the result is retained with its reason and cannot be treated as a successful test.
- A user attempts to view a permit, attachment, QR result, or report outside their plant, role,
  or assignment scope; access is denied and the attempt is audited where policy requires.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow authorized users to create, save, edit, submit, view, and
  search work permits with a unique permit identifier.
- **FR-002**: The system MUST capture permit type, priority, work description, plant, site, area,
  equipment, functional location, work organization, crew, contractor, planned dates, responsible
  roles, emergency contact, worker count, PPE, instructions, and supporting references.
- **FR-003**: The system MUST support configurable permit types, including cold work, hot work,
  confined space, electrical, excavation, working at height, line breaking, radiation, lifting,
  vehicle entry, and general maintenance.
- **FR-004**: The system MUST enforce the configured permit lifecycle and reject transitions that
  are invalid for the current status or actor.
- **FR-005**: The system MUST support the statuses DRAFT, SUBMITTED, UNDER_REVIEW, SAFETY_REVIEW,
  ISOLATION_PENDING, APPROVAL_PENDING, APPROVED, ISSUED, ACTIVE, SUSPENDED, RESUMED,
  EXTENSION_REQUESTED, EXPIRED, CLOSURE_PENDING, CLOSED, and CANCELLED.
- **FR-006**: The system MUST allow administrators to configure lifecycle transition rules,
  role permissions, approval levels, and transition prerequisites without changing permit data.
- **FR-007**: The system MUST calculate initial and residual risk from configurable likelihood and
  severity values and classify the result using the active risk matrix.
- **FR-008**: The system MUST require additional approval for high and critical residual risk
  when the active approval rules require it.
- **FR-009**: The system MUST provide permit-type-specific safety checklists with mandatory items
  and YES, NO, and N/A responses.
- **FR-010**: The system MUST prevent submission or approval when mandatory checklist items or
  configured safety controls are incomplete.
- **FR-011**: The system MUST support repeated gas tests with tester, time, readings, instrument,
  calibration information, result, remarks, and configurable threshold warnings.
- **FR-012**: The system MUST support electrical, mechanical, hydraulic, pneumatic, process,
  chemical, and instrumentation isolations with points, locks or tags, responsible people,
  timestamps, certificates, and the statuses REQUESTED, PLANNED, APPLIED, VERIFIED, and RELEASED.
- **FR-013**: The system MUST prevent issue when required isolations are not in their configured
  verified state.
- **FR-014**: The system MUST support configurable multi-level approvals based on permit type, risk,
  plant, area, work type, and isolation requirements.
- **FR-015**: The system MUST record approval decisions as APPROVE, REJECT, or SEND_BACK with
  approver, role, comments, and decision time.
- **FR-016**: The system MUST support issuing, activating, suspending, resuming, extending,
  expiring, and closing permits only for authorized users and valid conditions.
- **FR-017**: The system MUST send configurable in-app notifications for submission, approvals,
  decisions, issue, expiry, suspension, resumption, and closure actions, with optional external
  notification channels where configured.
- **FR-018**: The system MUST provide dashboards showing permit totals and status, risk, type, area,
  aging, expiry, and closure trends with filters for operational search.
- **FR-019**: The system MUST support search by permit, maintenance order, notification, equipment,
  functional location, plant, area, requester, contractor, type, status, and date range.
- **FR-020**: The system MUST provide secure attachment handling for safety documents, drawings,
  method statements, certificates, photographs, and supporting records, including type and size
  validation, access control, malware-scanning integration, and download auditing.
- **FR-021**: The system MUST generate a QR code or equivalent identifier for active permits and
  provide an authenticated verification view with permit number, type, work, equipment, location,
  status, validity, and issuer.
- **FR-022**: The system MUST provide a responsive field experience for viewing permits, approvals,
  checklists, gas tests, isolation verification, QR scanning, photographs, suspension, resumption,
  and closure.
- **FR-023**: The system MUST support optional offline access to assigned permits and safety data,
  queue safe deferred actions, synchronize them when connected, and surface conflicts for review.
- **FR-024**: The system MUST allow authorized users to search and associate SAP maintenance
  notifications, orders, operations, equipment, functional locations, and work centers with a
  permit while preserving source values as read-only context by default.
- **FR-025**: The system MUST support synchronous maintenance lookups and asynchronous synchronization
  without assuming a particular SAP release or fabricating unavailable source services.
- **FR-026**: The system MUST correlate, retry, report, and reprocess integration transactions and
  must never store authentication tokens or other secrets in logs.
- **FR-027**: The system MUST make outbound permit updates to SAP opt-in, capability-driven, and
  limited to explicitly supported business processes.
- **FR-028**: The system MUST enforce authentication, configurable RBAC, least privilege, input
  validation, secure headers, rate limits, safe errors, and protection against unauthorized data
  access.
- **FR-029**: The system MUST record an append-only audit trail for permit changes, risk and safety
  actions, approvals, lifecycle transitions, attachments, notifications, integration actions, and
  access to protected records, including actor, role, time, correlation ID, and relevant values.
- **FR-030**: The system MUST provide reports for daily permits, active and expired permits,
  high-risk work, hot work, confined space, isolations, contractors, closure, and maintenance
  order-to-permit relationships, with authorized export options.
- **FR-031**: The system MUST provide consistent user-facing error information with a safe error
  code, message, timestamp, and correlation identifier, without exposing internal diagnostics.
- **FR-032**: The system MUST preserve permit and audit history when a source maintenance object
  becomes unavailable, is changed, or is archived.
- **FR-033**: The system MUST use internal identifiers and retain authoritative SAP business
  identifiers for linked maintenance objects.
- **FR-034**: The system MUST support configurable plants, areas, roles, permissions, notification
  templates, PPE requirements, gas limits, validity periods, and other operational master data.

### Key Entities *(include if data involved)*

- **Permit**: A controlled work authorization with identity, type, location, work details,
  validity, status, risk, responsibilities, safety controls, references, and lifecycle history.
- **Permit Type**: A configurable category that defines applicable controls, checklist, validity,
  approval, gas-testing, PPE, and isolation requirements.
- **Risk Assessment**: Hazards, likelihood, severity, controls, responsible people, initial risk,
  and residual risk for a permit.
- **Safety Checklist**: A versioned set of permit-specific questions, responses, mandatory flags,
  and completion evidence.
- **Gas Test**: A timestamped set of readings, instrument details, tester, result, and remarks tied
  to a permit and its validity period.
- **Isolation**: A requested, applied, verified, or released control tied to equipment or an
  isolation point, including lock, tag, people, certificate, and timestamps.
- **Approval**: A configured decision step with required role, actor, outcome, comments, and time.
- **User and Role**: An authenticated person and their configurable authority, plant scope, and
  permissions.
- **Attachment**: A protected supporting file with classification, uploader, access policy, scan
  state, and audit history.
- **Maintenance Reference**: A read-only or explicitly governed link to a SAP notification, order,
  operation, equipment, functional location, or work center.
- **Audit Record**: An append-only record of a material action, actor, context, before and after
  values, time, and correlation identifier.
- **Notification**: A user-facing or external message generated by a lifecycle, approval, safety,
  expiry, or integration event.
- **Integration Transaction**: A correlated request or event with source object, status, timing,
  sanitized error details, retry state, and reprocessing history.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In usability testing, at least 90% of authorized requesters can create and submit a
  complete standard permit without assistance on their first attempt.
- **SC-002**: At least 95% of submitted permits have all mandatory safety checklist and configured
  control requirements complete before entering approval.
- **SC-003**: At least 99% of lifecycle actions recorded in testing have an associated actor,
  timestamp, resulting status, and auditable decision history.
- **SC-004**: At least 95% of authorized permit searches return matching results within 3 seconds
  for a dataset representing 100,000 permits.
- **SC-005**: At least 90% of field users can complete an assigned checklist or gas-test record on
  a phone or tablet without horizontal scrolling or loss of entered data.
- **SC-006**: 100% of attempted invalid or unauthorized lifecycle transitions are rejected and
  produce an actionable user message.
- **SC-007**: At least 98% of approved permits linked to available maintenance references display
  the selected source context without requiring duplicate manual entry.
- **SC-008**: At least 95% of high-risk permit reviews identify the required additional approval
  before issue in acceptance testing.
- **SC-009**: Authorized auditors can retrieve a complete permit history, including approvals,
  safety controls, isolations, attachments, and integration outcomes, in under 2 minutes.
- **SC-010**: Permit expiry, suspension, approval, and closure notifications reach the configured
  in-app recipients within 60 seconds in normal operating conditions.
- **SC-011**: No acceptance test exposes protected permit or attachment information to an
  unauthenticated or out-of-scope user.
- **SC-012**: Operations users report that the dashboard and filtered permit list provide enough
  information to identify active high-risk work without consulting a separate paper register.

## Assumptions

- Users authenticate through an enterprise identity service and are assigned roles and plant or
  area scope by an administrator.
- The initial release supports one organization with configurable plants and areas, while the
  data model permits later expansion to additional organizations.
- SAP access, available business objects, source services, and synchronization schedules are
  supplied and approved by the SAP team; the product does not assume a specific S/4HANA release.
- When external services are unavailable, the platform preserves safe read-only context and
  provides recoverable errors rather than bypassing controls.
- Industry and site policies determine retention periods, permitted offline actions, approval
  delegation, gas thresholds, and permit validity; these values are configurable before use.
- File malware scanning, email, optional collaboration notifications, and device camera or QR
  capabilities may be provided by enterprise services and are treated as integration dependencies.
- Reporting exports are limited to data the requesting user is authorized to view.
- The first delivery is focused on the core permit lifecycle and required safety controls; broad
  enterprise configuration and advanced offline conflict resolution are expanded incrementally.
