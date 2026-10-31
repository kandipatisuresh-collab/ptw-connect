---

description: "Executable task list for the Enterprise Permit to Work Platform"
---

# Tasks: Enterprise Permit to Work Platform

**Input**: Design documents from `specs/001-enterprise-ptw-platform/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, and `quickstart.md`

**Tests**: Test tasks are included because the constitution and feature specification require unit,
integration, contract, security, and end-to-end validation.

**Organization**: Tasks are grouped by user story so each increment has an independent test target.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel after stated prerequisites are complete.
- **[Story]**: Maps a task to a user story from `spec.md`.
- Every task includes a concrete repository path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the multi-area project structure, development conventions, and protected
configuration required by every story.

- [X] T001 Create the planned `frontend/`, `backend/`, `database/`, `integration/`, `workflows/`, `tests/`, `docs/`, and `infrastructure/` directories.
- [X] T002 Initialize workspace package manifests and TypeScript project references in `frontend/package.json`, `backend/package.json`, `integration/package.json`, and `package.json`.
- [X] T003 [P] Configure formatting, linting, typechecking, and commit-time checks in `eslint.config.mjs`, `prettier.config.mjs`, and `tsconfig.base.json`.
- [X] T004 [P] Add environment templates with non-secret placeholders in `.env.example`, `.env.test.example`, and `docs/CONFIGURATION.md`.
- [X] T005 [P] Add container and local development definitions in `infrastructure/containers/compose.yaml` and `infrastructure/containers/README.md`.
- [X] T006 [P] Add baseline CI workflow for typecheck, lint, and tests in `.github/workflows/ci.yml`.

**Checkpoint**: The repository has a reproducible local structure and no committed credentials.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared security, persistence, error, audit, workflow, and integration
boundaries. No user story work can begin until this phase is complete.

- [X] T007 Create PostgreSQL migration and seed conventions in `database/migrations/README.md`, `database/seeds/README.md`, and `database/erd/README.md`.
- [X] T008 Create the initial normalized schema migration for users, roles, permissions, scopes, permit types, configuration, and audit records in `database/migrations/001_foundation.sql`.
- [X] T009 [P] Define shared domain identifiers, timestamps, correlation IDs, result types, and safe error types in `backend/src/domain/shared/types.ts` and `backend/src/domain/shared/errors.ts`.
- [X] T010 [P] Define authentication claims, role permissions, plant and area scope, and authorization interfaces in `backend/src/domain/authorization/authorization.ts`.
- [X] T011 [P] Implement OIDC claim validation and request authorization middleware in `backend/src/infrastructure/identity/oidc-middleware.ts` and `backend/src/api/middleware/authorization.ts`.
- [X] T012 [P] Define structured logging with secret redaction and correlation propagation in `backend/src/infrastructure/observability/logger.ts` and `backend/src/api/middleware/correlation.ts`.
- [X] T013 [P] Implement the standardized safe error response and exception mapping in `backend/src/api/errors/error-response.ts` and `backend/src/api/middleware/error-handler.ts`.
- [X] T014 [P] Define database connection, transaction, migration, and repository interfaces in `backend/src/infrastructure/database/connection.ts` and `backend/src/infrastructure/database/repository.ts`.
- [X] T015 [P] Define append-only audit interfaces and persistence adapter in `backend/src/domain/audit/audit-service.ts` and `backend/src/infrastructure/database/audit-repository.ts`.
- [X] T016 [P] Define workflow state, transition, prerequisite, task, and concurrency interfaces in `backend/src/domain/workflow/workflow-types.ts` and `backend/src/domain/workflow/workflow-service.ts`.
- [X] T017 [P] Define notification, secure storage, file scanning, and QR capability interfaces in `backend/src/application/ports/notification-port.ts`, `backend/src/application/ports/storage-port.ts`, `backend/src/application/ports/scanning-port.ts`, and `backend/src/application/ports/qr-port.ts`.
- [X] T018 [P] Define capability-based SAP adapter interfaces in `integration/src/sap/sap-service.ts`, `integration/src/sap/notification-service.ts`, `integration/src/sap/maintenance-order-service.ts`, `integration/src/sap/equipment-service.ts`, `integration/src/sap/functional-location-service.ts`, and `integration/src/sap/work-center-service.ts`.
- [X] T019 [P] Add request validation and API contract test harnesses in `tests/contract/test-harness.ts` and `tests/integration/test-context.ts`.
- [X] T020 Add foundational unit and integration tests for authorization scope, safe errors, correlation IDs, audit immutability, and workflow concurrency in `backend/tests/unit/foundation.test.ts` and `backend/tests/integration/foundation.test.ts`.

**Checkpoint**: Authentication, authorization, data access, audit, errors, workflow interfaces, and
external-service ports are testable independently.

---

## Phase 3: User Story 1 - Create and Submit a Permit (Priority: P1) MVP

**Goal**: Permit Requesters can create a draft, complete required work information, submit it for
review, and see the resulting audit and workflow state.

**Independent Test**: As an authorized requester, create a permit, save it, complete required
fields, submit it, and verify reviewer visibility, status history, and authorization rejection for
an out-of-scope plant.

### Tests for User Story 1

- [X] T021 [P] [US1] Add REST contract tests for create, update, get, search, and submit operations in `tests/contract/permit-create.contract.test.ts`.
- [X] T022 [P] [US1] Add integration tests for draft persistence, required-field validation, plant scope, and submission audit in `tests/integration/permit-create.integration.test.ts`.

### Implementation for User Story 1

- [X] T023 [P] [US1] Implement User, Role, Permission, Plant, Area, and PermitType persistence models and repositories in `backend/src/domain/identity/models.ts`, `backend/src/domain/permits/permit-type.ts`, and `backend/src/infrastructure/database/permit-reference-repository.ts`.
- [X] T024 [P] [US1] Implement the Permit aggregate, draft validation, permit number generation, and editable-field rules in `backend/src/domain/permits/permit.ts` and `backend/src/domain/permits/permit-validation.ts`.
- [X] T025 [P] [US1] Add permit, permit type, and permit status history migrations in `database/migrations/002_permits.sql`.
- [X] T026 [US1] Implement permit repository transactions and optimistic version checks in `backend/src/infrastructure/database/permit-repository.ts`.
- [X] T027 [US1] Implement create, update, get, and authorized search application services in `backend/src/application/permits/permit-command-service.ts` and `backend/src/application/permits/permit-query-service.ts`.
- [X] T028 [US1] Implement submit transition validation, workflow task creation, status history, audit, and correlation handling in `backend/src/application/permits/submit-permit.ts`.
- [X] T029 [US1] Expose permit resource and submit command routes in `backend/src/api/permits/permit-routes.ts` and request schemas in `backend/src/api/permits/permit-schemas.ts`.
- [X] T030 [P] [US1] Implement the permit creation wizard and draft form validation in `frontend/src/features/permits/PermitCreatePage.tsx`, `frontend/src/features/permits/PermitForm.tsx`, and `frontend/src/features/permits/permit-client.ts`.
- [X] T031 [P] [US1] Implement permit list, detail, status history, and reviewer visibility views in `frontend/src/features/permits/PermitListPage.tsx`, `frontend/src/features/permits/PermitDetailPage.tsx`, and `frontend/src/features/permits/PermitStatusBadge.tsx`.
- [X] T032 [US1] Add API-to-UI authorization handling, validation messages, loading states, and safe error display in `frontend/src/services/api-client.ts` and `frontend/src/features/permits/permit-errors.ts`.
- [X] T033 [US1] Add the User Story 1 end-to-end journey and unauthorized plant scenario in `tests/e2e/permit-create.e2e.ts`.

**Checkpoint**: User Story 1 is independently demonstrable as the MVP.

---

## Phase 4: User Story 2 - Assess Risk and Safety Controls (Priority: P1)

**Goal**: Safety reviewers can record hazards, calculate risk, complete dynamic checklists, record
gas tests, and enforce safety gates before approval.

**Independent Test**: Add hazard controls, verify risk calculations and high-risk approval rules,
complete a permit-specific checklist, record gas readings, and confirm unsafe or incomplete controls
block progression.

### Tests for User Story 2

- [X] T034 [P] [US2] Add unit tests for likelihood-severity scoring, risk categories, residual risk, and high-critical escalation in `backend/tests/unit/risk-assessment.test.ts`.
- [X] T035 [P] [US2] Add integration tests for checklist gates, gas thresholds, calibration validation, and safety notifications in `tests/integration/safety-controls.integration.test.ts`.
- [X] T036 [P] [US2] Add contract tests for risk, checklist, gas-test, and safety-review routes in `tests/contract/safety-controls.contract.test.ts`.

### Implementation for User Story 2

- [X] T037 [P] [US2] Add risk matrix, hazard, risk control, and risk assessment migrations in `database/migrations/003_risk_and_safety.sql`.
- [X] T038 [P] [US2] Implement risk assessment entities and configurable score/category calculation in `backend/src/domain/safety/risk-assessment.ts` and `backend/src/domain/safety/risk-matrix.ts`.
- [X] T039 [P] [US2] Implement versioned checklist definitions, responses, mandatory-item validation, and response options in `backend/src/domain/safety/checklist.ts` and `backend/src/domain/safety/checklist-service.ts`.
- [X] T040 [P] [US2] Implement gas test validation, threshold evaluation, instrument calibration rules, and repeated test storage in `backend/src/domain/safety/gas-test.ts` and `backend/src/domain/safety/gas-test-service.ts`.
- [X] T041 [US2] Implement safety control repositories and migrations for PPE, checklist, gas-test, and risk records in `backend/src/infrastructure/database/safety-repository.ts`.
- [X] T042 [US2] Add safety prerequisites to workflow evaluation and approval task generation in `backend/src/application/workflow/safety-prerequisites.ts` and `backend/src/application/workflow/approval-planner.ts`.
- [X] T043 [US2] Expose risk, checklist, gas-test, and safety review routes in `backend/src/api/safety/safety-routes.ts` and `backend/src/api/safety/safety-schemas.ts`.
- [X] T044 [P] [US2] Implement risk assessment and checklist screens in `frontend/src/features/safety/RiskAssessmentPanel.tsx` and `frontend/src/features/safety/SafetyChecklistPanel.tsx`.
- [X] T045 [P] [US2] Implement gas-test entry, threshold warning, and test history views in `frontend/src/features/safety/GasTestPanel.tsx` and `frontend/src/features/safety/GasTestHistory.tsx`.
- [X] T046 [US2] Add the User Story 2 end-to-end safety-gate journey in `tests/e2e/safety-controls.e2e.ts`.

**Checkpoint**: Safety evidence is independently testable and unsafe submissions or approvals are blocked.

---

## Phase 5: User Story 3 - Manage Isolations and Approvals (Priority: P1)

**Goal**: Isolation Authorities can progress isolations safely and configured approvers can make
recorded decisions before issue.

**Independent Test**: Create an isolation, progress it through valid states, complete approvals,
and verify that issue remains blocked until every required isolation is VERIFIED.

### Tests for User Story 3

- [X] T047 [P] [US3] Add unit tests for isolation state transitions, required verification, approval decisions, delegation, and rejection in `backend/tests/unit/isolation-approval.test.ts`.
- [X] T048 [P] [US3] Add contract tests for isolation and approval commands in `tests/contract/isolation-approval.contract.test.ts`.
- [X] T049 [P] [US3] Add integration tests for issue blocking, approval history, and notification creation in `tests/integration/isolation-approval.integration.test.ts`.

### Implementation for User Story 3

- [X] T050 [P] [US3] Add isolation points, isolations, certificates, approval rules, approvals, and workflow tasks migrations in `database/migrations/004_isolation_and_approval.sql`.
- [X] T051 [P] [US3] Implement isolation point and isolation aggregates with REQUESTED, PLANNED, APPLIED, VERIFIED, and RELEASED transition guards in `backend/src/domain/isolation/isolation.ts`.
- [X] T052 [P] [US3] Implement approval decision model, required-role matching, delegation constraints, and immutable decision records in `backend/src/domain/approval/approval.ts`.
- [X] T053 [US3] Implement isolation and approval repositories in `backend/src/infrastructure/database/isolation-repository.ts` and `backend/src/infrastructure/database/approval-repository.ts`.
- [X] T054 [US3] Implement isolation commands, approval commands, notifications, and issue prerequisites in `backend/src/application/isolation/isolation-service.ts`, `backend/src/application/approval/approval-service.ts`, and `backend/src/application/workflow/issue-prerequisites.ts`.
- [X] T055 [US3] Expose isolation, approval, and workflow routes in `backend/src/api/isolation/isolation-routes.ts`, `backend/src/api/approval/approval-routes.ts`, and `backend/src/api/workflow/workflow-routes.ts`.
- [X] T056 [P] [US3] Implement isolation verification and approval task screens in `frontend/src/features/isolations/IsolationPanel.tsx` and `frontend/src/features/approvals/ApprovalQueuePage.tsx`.
- [X] T057 [US3] Add the User Story 3 end-to-end isolation and approval journey in `tests/e2e/isolation-approval.e2e.ts`.

**Checkpoint**: Isolation and approval controls independently prevent unsafe issue actions.

---

## Phase 6: User Story 4 - Issue and Control Active Work (Priority: P1)

**Goal**: Permit Issuers and field authorities can issue, activate, suspend, resume, extend, expire,
and close permits with notifications and audit evidence.

**Independent Test**: Take an approved permit through issue, activation, suspension, resumption, and
closure, then attempt invalid and unauthorized transitions.

### Tests for User Story 4

- [X] T058 [P] [US4] Add unit tests for complete lifecycle transitions, expiry, extension, concurrency conflicts, and unauthorized commands in `backend/tests/unit/permit-lifecycle.test.ts`.
- [X] T059 [P] [US4] Add contract tests for issue, activate, suspend, resume, extend, and close routes in `tests/contract/permit-lifecycle.contract.test.ts`.
- [X] T060 [US4] Add the complete lifecycle end-to-end journey from approved permit to closure in `tests/e2e/permit-lifecycle.e2e.ts`.

### Implementation for User Story 4

- [X] T061 [US4] Implement lifecycle command handlers and transition audit records in `backend/src/application/permits/lifecycle-command-service.ts`.
- [X] T062 [US4] Implement permit expiry scheduler and extension policy evaluation in `backend/src/application/permits/permit-expiry-service.ts` and `backend/src/application/permits/permit-extension-service.ts`.
- [X] T063 [P] [US4] Implement notification templates and in-app delivery for lifecycle events in `backend/src/infrastructure/notifications/notification-service.ts` and `backend/src/infrastructure/notifications/templates/permit-events.ts`.
- [X] T064 [US4] Wire lifecycle routes, idempotency keys, version conflicts, and safe error responses in `backend/src/api/permits/lifecycle-routes.ts`.
- [X] T065 [P] [US4] Implement issuer active-work controls and lifecycle action confirmation in `frontend/src/features/permits/PermitLifecycleActions.tsx` and `frontend/src/features/permits/ActivePermitPage.tsx`.
- [X] T066 [US4] Add lifecycle status history, notification, and audit views in `frontend/src/features/permits/PermitHistoryPanel.tsx`.

**Checkpoint**: User Story 4 provides the core safe work-control lifecycle.

---

## Phase 7: User Story 5 - Monitor Permits and Respond in the Field (Priority: P2)

**Goal**: Operations users can search and monitor permits, verify active permits by QR, and complete
assigned field actions on responsive mobile and tablet views.

**Independent Test**: Filter a representative permit set, open an active permit on a phone-sized
viewport, scan its identifier, and complete an assigned field action without data loss.

### Tests for User Story 5

- [X] T067 [P] [US5] Add responsive and accessibility tests for permit monitoring, action controls, and QR verification in `frontend/tests/field-workflows.test.tsx`.
- [X] T068 [P] [US5] Add authorization tests for QR, attachment, and field-action scope in `tests/integration/field-authorization.integration.test.ts`.

### Implementation for User Story 5

- [X] T069 [P] [US5] Implement dashboard aggregation and filtered permit search queries in `backend/src/application/dashboard/dashboard-query-service.ts` and `backend/src/application/permits/permit-search-service.ts`.
- [X] T070 [P] [US5] Implement QR identifier generation and authenticated verification contract in `backend/src/application/qr/permit-qr-service.ts` and `backend/src/api/qr/qr-routes.ts`.
- [X] T071 [P] [US5] Implement attachment metadata, upload authorization, scan state, and download audit in `backend/src/domain/attachments/attachment.ts` and `backend/src/application/attachments/attachment-service.ts`.
- [X] T072 [US5] Implement safe offline cache, queued-action policy, idempotent synchronization, and conflict reporting in `frontend/src/services/offline-store.ts` and `backend/src/application/offline/offline-sync-service.ts`.
- [X] T073 [P] [US5] Implement responsive dashboard, permit filters, QR verification, and field action components in `frontend/src/features/dashboard/DashboardPage.tsx`, `frontend/src/features/permits/PermitFilters.tsx`, and `frontend/src/features/qr/PermitVerificationPage.tsx`.
- [X] T074 [P] [US5] Implement mobile attachment capture and offline status indicators in `frontend/src/features/attachments/AttachmentCapture.tsx` and `frontend/src/features/offline/OfflineStatus.tsx`.
- [X] T075 [US5] Add quickstart field validation scenarios to `tests/e2e/field-workflows.e2e.ts`.

**Checkpoint**: Field users can monitor and perform authorized actions responsively without exposing protected data.

---

## Phase 8: User Story 6 - Integrate Maintenance Context and Report Compliance (Priority: P2)

**Goal**: Planners can link authoritative SAP PM context to permits, administrators can reprocess
integration failures, and auditors can retrieve reports and complete history.

**Independent Test**: Search and link a maintenance order and notification, inspect read-only source
context, simulate a source failure, reprocess it, and retrieve an authorized audit report.

### Tests for User Story 6

- [X] T076 [P] [US6] Add SAP adapter contract tests for notifications, orders, operations, equipment, functional locations, and work centers in `integration/tests/sap-adapter.contract.test.ts`.
- [X] T077 [P] [US6] Add integration tests for correlation IDs, retry, error queue, reprocessing, and secret redaction in `integration/tests/synchronization.integration.test.ts`.
- [X] T078 [P] [US6] Add report authorization and audit completeness tests in `tests/integration/reporting.integration.test.ts`.

### Implementation for User Story 6

- [X] T079 [P] [US6] Add SAP reference snapshots, integration transactions, integration errors, and report query indexes in `database/migrations/005_sap_and_reporting.sql`.
- [X] T080 [P] [US6] Implement SAP capability adapters and source mapping configuration in `integration/src/sap/sap-adapter.ts`, `integration/src/sap/source-mappers.ts`, and `integration/src/sap/sap-client.ts`.
- [X] T081 [US6] Implement linked maintenance reference search, read-only snapshots, synchronization checkpoints, retries, and reprocessing in `backend/src/application/sap/maintenance-reference-service.ts` and `integration/src/synchronization/sync-service.ts`.
- [X] T082 [US6] Implement opt-in outbound permit status capability checks and sanitized integration event publishing in `integration/src/outbound/permit-update-service.ts` and `integration/src/events/event-publisher.ts`.
- [X] T083 [P] [US6] Implement dashboard charts, report queries, authorized exports, and audit report views in `backend/src/application/reporting/report-service.ts` and `frontend/src/features/reports/ReportsPage.tsx`.
- [X] T084 [P] [US6] Implement SAP search and linked-reference UI in `frontend/src/features/sap/SapSearchPanel.tsx` and `frontend/src/features/sap/MaintenanceReferenceCard.tsx`.
- [X] T085 [US6] Add SAP failure recovery, reporting, and auditor read-only journeys in `tests/e2e/sap-reporting.e2e.ts`.

**Checkpoint**: Maintenance context, recoverable synchronization, and compliance reporting are independently verifiable.

---

## Phase 9: Polish and Cross-Cutting Concerns

**Purpose**: Complete security, accessibility, observability, documentation, deployment, and full
quickstart validation across all stories.

- [X] T086 [P] Add security tests for authentication, authorization bypass, injection, XSS, CSRF, rate limiting, secure headers, file access, and data leakage in `tests/security/security-regression.test.ts`.
- [X] T087 [P] Add database indexes, migration rollback checks, backup/restore validation, and retention controls in `database/migrations/006_operational_hardening.sql` and `tests/integration/database-hardening.integration.test.ts`.
- [X] T088 [P] Add accessibility, keyboard navigation, contrast, responsive layout, and loading/error state checks in `frontend/tests/accessibility.test.tsx`.
- [X] T089 [P] Complete architecture, API, database, SAP, workflow, security, deployment, and testing documentation in `docs/ARCHITECTURE.md`, `docs/API.md`, `docs/DATABASE.md`, `docs/SAP-INTEGRATION.md`, `docs/WORKFLOW.md`, `docs/SECURITY.md`, `docs/DEPLOYMENT.md`, and `docs/TESTING.md`.
- [X] T090 [P] Configure production monitoring, alerting, correlation dashboards, and sanitized integration metrics in `infrastructure/monitoring/observability.yaml` and `backend/src/infrastructure/observability/metrics.ts`.
- [X] T091 Run the complete validation scenarios from `specs/001-enterprise-ptw-platform/quickstart.md` and record results in `tests/e2e/quickstart-validation.md`.
- [X] T092 Review all configured controls, authorization rules, audit events, external dependencies, and operational runbooks against the constitution in `docs/COMPLIANCE-REVIEW.md`.

---

## Dependencies and Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T001-T006 can begin immediately, with T003-T006 parallel after T001.
- **Foundational (Phase 2)**: Depends on T001-T006; T009-T019 can proceed in parallel after the repository structure exists, while T020 depends on the shared interfaces.
- **User Stories (Phases 3-8)**: Depend on Phase 2 completion. P1 stories proceed in order because safety and lifecycle stories build on the permit aggregate; P2 stories follow the P1 lifecycle.
- **Polish (Phase 9)**: Depends on the desired user stories and their checkpoints being complete.

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 2; MVP independently delivers permit creation and submission.
- **US2 (P1)**: Depends on US1 permit and workflow records; can parallelize risk, checklist, and gas modules within the story.
- **US3 (P1)**: Depends on US2 safety prerequisites and US1 workflow; isolation and approval modules can parallelize after shared migrations are agreed.
- **US4 (P1)**: Depends on US3 issue prerequisites and approval records; lifecycle command, notification, and UI work can parallelize where paths differ.
- **US5 (P2)**: Depends on US4 active permit behavior; dashboard, QR, attachments, and responsive UI can parallelize.
- **US6 (P2)**: Depends on US1 permit references and the foundational SAP ports; SAP adapters, reporting, and contract tests can parallelize after migration contracts are stable.

### Parallel Opportunities

- Setup tasks T003-T006 can run in parallel after T001-T002.
- Foundational interfaces T009-T019 can run in parallel by boundary, then T020 validates them together.
- Within US1, T021-T022 and T023-T025 can run in parallel; service and UI work follows the contracts.
- Within US2, T034-T036 and T037-T040 can run in parallel; T041-T046 integrate the results.
- Within US3, T047-T052 and T056 can run in parallel after the data contract; T053-T057 integrate them.
- Within US4, T058-T060, T063, and T065 can run in parallel after the lifecycle contract.
- Within US5, T067-T071 and T073-T074 can run in parallel after US4.
- Within US6, T076-T080, T083, and T084 can run in parallel after the source contract and migration decision.
- Polish tasks T086-T090 can run in parallel; T091-T092 are final gates.

## Parallel Execution Examples

### User Story 1

```text
Task T021: Contract tests in tests/contract/permit-create.contract.test.ts
Task T022: Integration tests in tests/integration/permit-create.integration.test.ts
Task T023: Reference models in backend/src/domain/identity/models.ts
Task T024: Permit aggregate in backend/src/domain/permits/permit.ts
Task T025: Permit migrations in database/migrations/002_permits.sql
Task T030: Create wizard in frontend/src/features/permits/PermitCreatePage.tsx
Task T031: Permit list in frontend/src/features/permits/PermitListPage.tsx
```

### User Story 2

```text
Task T034: Risk unit tests in backend/tests/unit/risk-assessment.test.ts
Task T035: Safety integration tests in tests/integration/safety-controls.integration.test.ts
Task T037: Safety migrations in database/migrations/003_risk_and_safety.sql
Task T038: Risk domain in backend/src/domain/safety/risk-assessment.ts
Task T039: Checklist domain in backend/src/domain/safety/checklist.ts
Task T040: Gas-test domain in backend/src/domain/safety/gas-test.ts
Task T044: Risk and checklist UI in frontend/src/features/safety/
Task T045: Gas-test UI in frontend/src/features/safety/
```

### User Story 6

```text
Task T076: SAP contract tests in integration/tests/sap-adapter.contract.test.ts
Task T077: Synchronization tests in integration/tests/synchronization.integration.test.ts
Task T079: SAP/reporting migration in database/migrations/005_sap_and_reporting.sql
Task T080: SAP adapter in integration/src/sap/
Task T083: Reporting in backend/src/application/reporting/ and frontend/src/features/reports/
Task T084: SAP UI in frontend/src/features/sap/
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 foundation, including authorization, workflow, audit, errors, and ports.
3. Complete Phase 3 User Story 1.
4. Run the independent User Story 1 tests and the first quickstart scenario.
5. Stop for stakeholder review before adding safety modules.

### Incremental Delivery

1. Add US2 risk and safety gates, then validate independently.
2. Add US3 isolation and approval controls, then validate issue blocking.
3. Add US4 active-work lifecycle controls, then validate the complete permit path.
4. Add US5 field monitoring and protected evidence.
5. Add US6 SAP context and reporting.
6. Complete polish gates and production readiness review.

## Independent Test Criteria by Story

- **US1**: A requester can create, save, submit, and audit a permit; out-of-scope plant access is rejected.
- **US2**: Risk, checklist, gas-test, and high-risk approval gates block unsafe progression and preserve evidence.
- **US3**: Isolation transitions and multi-level approval decisions are recorded; issue is blocked until required isolations are VERIFIED.
- **US4**: An approved permit can be issued, activated, suspended, resumed, extended when allowed, and closed; invalid transitions fail safely.
- **US5**: Authorized users can filter and inspect permits, verify an active permit by QR, and complete a responsive field action without data loss or leakage.
- **US6**: A maintenance reference can be linked and recovered after source failure; an auditor can retrieve complete read-only reports.

## Format Validation

All 92 tasks follow the required checklist format: `- [ ]` checkbox, sequential `T###` ID,
optional `[P]` marker only for parallel work, required `[US#]` label in story phases, and a concrete
file path in every task description.

## Notes

- Tasks are intentionally specific enough for an implementation agent to execute without reopening
  the full PRD.
- Configuration values such as gas limits, retention, approval delegation, and SAP services remain
  policy or landscape inputs and must not be invented during implementation.
- No task bypasses authorization, safety gates, audit records, or secret-management requirements.
