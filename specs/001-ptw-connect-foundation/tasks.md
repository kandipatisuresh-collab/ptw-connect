---

description: "Task list for PTW Connect Phase 1 foundation artifacts"
---

# Tasks: PTW Connect Phase 1 Foundation

**Input**: Design documents from `specs/001-ptw-connect-foundation/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [backlog.md](./backlog.md), [assumptions-and-open-questions.md](./assumptions-and-open-questions.md), and [quickstart.md](./quickstart.md)

**Scope**: Phase 1 architecture and contract artifacts only. Do not create business
code, runtime scaffolding, database migrations, containers, CI behavior, or external
system calls.

**Tests**: No executable test tasks are included because the feature specification is
explicitly documentation-only. Artifact validation and human review tasks are included
in the final phase and use [quickstart.md](./quickstart.md).

**Organization**: Tasks are grouped by user story so each design slice can be reviewed
independently. User Story 1 and User Story 2 are both P1; User Story 3 is P2.

## Task Phase 1: Setup (Shared Documentation Infrastructure)

**Purpose**: Confirm the Phase 1 boundary and establish shared review artifacts before
story-specific documentation is expanded.

- [x] T001 Review `specs/001-ptw-connect-foundation/plan.md`, `specs/001-ptw-connect-foundation/spec.md`, `specs/001-ptw-connect-foundation/research.md`, `specs/001-ptw-connect-foundation/data-model.md`, `specs/001-ptw-connect-foundation/contracts/`, `specs/001-ptw-connect-foundation/backlog.md`, `specs/001-ptw-connect-foundation/assumptions-and-open-questions.md`, `docs/assumptions-and-open-questions.md`, and `specs/001-ptw-connect-foundation/quickstart.md`; record the approved documentation-only scope and PRD Phase 2 boundary in `specs/001-ptw-connect-foundation/plan.md`
- [x] T002 [P] Create `specs/001-ptw-connect-foundation/artifact-index.md` with each Phase 1 artifact, owning concern, source requirement, reviewer role, and link to the artifact
- [x] T003 [P] Create `specs/001-ptw-connect-foundation/checklists/phase-1-review.md` with architecture, HSE, operations, security, legal/compliance, SAP, and no-business-code gate sections
- [x] T004 [P] Create `specs/001-ptw-connect-foundation/traceability.md` with a matrix structure for mapping FR-001 through FR-015, SC-001 through SC-007, and the three user stories to artifact paths

---

## Task Phase 2: Foundational (Blocking Safety and Contract Rules)

**Purpose**: Establish shared constraints that every user-story artifact must reference.

**CRITICAL**: User-story documentation must not be finalized until this task phase is
complete. This is distinct from PRD Phase 2, which is runtime scaffolding.

- [x] T005 Consolidate human-control, server-derived identity, plant/location scope, segregation-of-duties, fail-closed, idempotency, and optimistic-concurrency rules in `specs/001-ptw-connect-foundation/contracts/authorization-contract.md`
- [x] T006 [P] Consolidate `/api/v1`, DTO-only boundaries, standard status outcomes, RFC 7807-compatible problems, pagination/filtering/sorting, correlation IDs, idempotency keys, version conflicts, and the operation-level contract reference in `specs/001-ptw-connect-foundation/contracts/api-outline.md` and `specs/001-ptw-connect-foundation/contracts/operation-contract-matrix.md`
- [x] T007 [P] Define append-only workflow and audit evidence, redaction, retention, legal hold, and controlled closed-permit amendment rules in `specs/001-ptw-connect-foundation/contracts/audit-contract.md`
- [x] T008 [P] Define backend-only SAP access, notification outbox behavior, proposed/unverified SAP fields, mapping protection, retry/dead-letter expectations, and sanitized failures in `specs/001-ptw-connect-foundation/contracts/integration-contract.md`
- [x] T009 [P] Update `specs/001-ptw-connect-foundation/quickstart.md` with the shared prerequisites, no-runtime limitation, and artifact checks that apply to every user story
- [x] T010 Normalize the 17-state vocabulary, fail-closed defaults, and proposed/configurable wording across `specs/001-ptw-connect-foundation/research.md`, `specs/001-ptw-connect-foundation/data-model.md`, and `specs/001-ptw-connect-foundation/contracts/`

**Checkpoint**: Shared safety, authorization, integration, audit, and validation rules
are established; User Stories 1, 2, and 3 may now be developed as documentation slices.

---

## Task Phase 3: User Story 1 - Review the Approved Solution Shape (Priority: P1) 🎯 MVP

**Goal**: Give product, HSE, operations, architecture, and technical reviewers a clear
system boundary, repository ownership model, human decision boundary, and Phase 1 gate.

**Independent Test**: A reviewer can read the architecture and repository artifacts,
identify every target monorepo responsibility and trust boundary, trace human approval
through closure, and confirm that no Phase 2 implementation is represented as complete.

### Implementation for User Story 1

- [x] T011 [US1] Create `specs/001-ptw-connect-foundation/architecture.md` with PTW Connect purpose, actors, system responsibilities, trust boundaries, human decision points, external-system boundaries, and safety limitation
- [x] T012 [P] [US1] Create `specs/001-ptw-connect-foundation/repository-structure.md` with the PRD monorepo tree, ownership of `frontend`, `backend`, `database`, `integration`, `deployment`, `docs`, `.github`, and root configuration files
- [x] T013 [US1] Add the Mermaid architecture diagram to `specs/001-ptw-connect-foundation/architecture.md`, showing users, frontend, secured backend, MySQL boundary, object storage, identity provider, SAP boundary, notification boundary, audit/operations, and the prohibition on browser-to-SAP calls
- [x] T014 [US1] Add the approval-versus-activation boundary and explicit human actor responsibilities for approval, issue, activation, suspension, extension, handback, closure, cancellation, and expiry to `specs/001-ptw-connect-foundation/architecture.md`
- [x] T015 [US1] Add Phase 1/Phase 2 scope limits, architecture acceptance criteria, reviewer responsibilities, and unresolved risks to `specs/001-ptw-connect-foundation/architecture.md` and `specs/001-ptw-connect-foundation/repository-structure.md`

**Checkpoint**: User Story 1 is reviewable independently using only
`architecture.md`, `repository-structure.md`, `plan.md`, and `quickstart.md`.

---

## Task Phase 4: User Story 2 - Validate the Domain and Data Foundation (Priority: P1)

**Goal**: Give HSE and operations reviewers a complete, configurable permit domain,
lifecycle, safety-evidence model, audit boundary, and ER diagram.

**Independent Test**: A reviewer can trace the permit through all 17 states and safety
checkpoints, identify the required entities and relationships, and confirm that missing
evidence or authorization cannot silently permit activation.

### Implementation for User Story 2

- [x] T016 [US2] Create `specs/001-ptw-connect-foundation/workflow.md` with the 17-state vocabulary, allowed transition categories, human roles, mandatory evidence, comments, SOD checks, idempotency, optimistic concurrency, and approval-not-activation rule
- [x] T017 [P] [US2] Complete `specs/001-ptw-connect-foundation/data-model.md` with identity, organization/site master data, permit, safety evidence, workflow, handover, integration, notification, audit, and idempotency entities from the PRD
- [x] T018 [US2] Add or verify the Mermaid ER diagram and document UUIDs, UTC timestamps, plant/site timezone, foreign keys, version columns, query-driven indexes, attachment references, and append-only history boundaries in `specs/001-ptw-connect-foundation/data-model.md`
- [x] T019 [P] [US2] Create `specs/001-ptw-connect-foundation/hse-validation-checklist.md` requiring competent HSE and operations review of permit types, hazards, risk matrix, gas limits, isolation rules, approval levels, handover, extensions, suspension/resumption, validity, legal requirements, retention, and emergency procedures
- [x] T020 [US2] Add activation, suspension, extension, handback, closure, expiry, and controlled-amendment evidence rules to `specs/001-ptw-connect-foundation/workflow.md`
- [x] T021 [US2] Cross-link `specs/001-ptw-connect-foundation/workflow.md`, `specs/001-ptw-connect-foundation/data-model.md`, `specs/001-ptw-connect-foundation/contracts/authorization-contract.md`, and `specs/001-ptw-connect-foundation/hse-validation-checklist.md` so each transition and entity has one consistent safety interpretation

**Checkpoint**: User Story 2 is reviewable independently using the domain model, ER diagram, workflow contract, authorization contract, and HSE checklist.

---

## Task Phase 5: User Story 3 - Review the API and Delivery Backlog (Priority: P2)

**Goal**: Give delivery and security reviewers a complete API outline, dependency-ordered
Phase 1-to-9 backlog, explicit acceptance criteria, assumptions, owners, and traceability.

**Independent Test**: A reviewer can select any backlog item, find its requirement,
dependency, owner boundary, assumption, acceptance evidence, and related API/domain
contract without relying on implementation code or an external SAP environment.

### Implementation for User Story 3

- [x] T022 [US3] Complete `specs/001-ptw-connect-foundation/contracts/api-outline.md` and `specs/001-ptw-connect-foundation/contracts/operation-contract-matrix.md` with identity/master data, permits, risk, isolation, gas testing, toolbox talks, workflow commands, SAP, notifications, dashboards/reports, audit, handover, and health operations
- [x] T023 [P] [US3] Create `specs/001-ptw-connect-foundation/backlog.md` with dependency-ordered Phase 1 through Phase 9 work and, for every backlog item, acceptance criteria, owner, dependencies, requirements, assumptions, evidence, validation command, and gate
- [x] T024 [P] [US3] Create `specs/001-ptw-connect-foundation/assumptions-and-open-questions.md` and synchronize it with the constitution-required `docs/assumptions-and-open-questions.md`, including named validation owners for HSE rules, legal requirements, identity claims, notification channels, deployment constraints, data retention, and SAP metadata/connectivity/mappings
- [x] T025 [P] [US3] Complete `specs/001-ptw-connect-foundation/contracts/integration-contract.md` with the proposed canonical maintenance-order fields, configurable placeholders, callback/replay controls, stale-data behavior, and customer metadata validation prerequisite
- [x] T026 [US3] Add data classification and synthetic-data handling for personal, safety, operational, integration, and audit data to `specs/001-ptw-connect-foundation/assumptions-and-open-questions.md` and `specs/001-ptw-connect-foundation/research.md`
- [x] T027 [US3] Complete `specs/001-ptw-connect-foundation/traceability.md` by mapping every FR, SC, user-story acceptance scenario, API contract group, data-model area, backlog-item evidence field, and validation command to an artifact path

**Checkpoint**: User Story 3 is reviewable independently using the API outline, backlog, assumptions/open questions, traceability matrix, and contract documents.

---

## Task Phase 6: Polish and Cross-Cutting PRD Phase 1 Gate

**Purpose**: Remove inconsistencies, execute artifact validation, and record the human
review gate. This phase still creates no runtime behavior.

- [x] T028 [P] Normalize links, terminology, 17-state references, proposed/unverified SAP language, Task Phase/PRD Phase wording, and Phase 1 scope wording across `specs/001-ptw-connect-foundation/*.md`, `specs/001-ptw-connect-foundation/contracts/*.md`, and `docs/assumptions-and-open-questions.md`
- [x] T029 Update `specs/001-ptw-connect-foundation/quickstart.md` with the final artifact inventory, including `architecture.md`, `repository-structure.md`, `workflow.md`, `hse-validation-checklist.md`, `backlog.md`, `traceability.md`, `contracts/operation-contract-matrix.md`, the root assumptions record, validation commands, expected outcomes, and reviewer sign-off evidence paths
- [x] T030 Run every structural, placeholder, contract-coverage, operation-matrix, backlog-evidence, state-coverage, Mermaid architecture/ERD review, and no-business-code command in `specs/001-ptw-connect-foundation/quickstart.md`; record command, date, result, diagram rendering/review result, and environment in `specs/001-ptw-connect-foundation/review-record.md`
- [x] T031 Perform the constitution review and explicit rendered Mermaid architecture and ERD review against `specs/001-ptw-connect-foundation/plan.md`, `specs/001-ptw-connect-foundation/spec.md`, `specs/001-ptw-connect-foundation/data-model.md`, `specs/001-ptw-connect-foundation/architecture.md`, `specs/001-ptw-connect-foundation/contracts/`, and `docs/assumptions-and-open-questions.md`; record PASS/FAIL, reviewer/date, evidence, and blockers in `specs/001-ptw-connect-foundation/checklists/phase-1-review.md` and `specs/001-ptw-connect-foundation/review-record.md`
- [x] T032 Verify that no frontend/backend source, Flyway migration, Docker/Helm runtime asset, CI workflow, SAP call, notification delivery, or production data was added; treat the root `.dockerignore` as repository hygiene only and record the negative-scope result in `specs/001-ptw-connect-foundation/review-record.md`
- [x] T033 Finalize `specs/001-ptw-connect-foundation/plan.md` with generated artifact links, executed validation, remaining HSE/operations/security/legal/SAP risks, and the explicit decision that Phase 2 remains blocked until required human approvals are recorded

---

## Dependencies and Execution Order

### Phase Dependencies

- **Task Phase 1 (Setup)**: No implementation dependency; establishes scope and shared review files.
- **Task Phase 2 (Foundational)**: Depends on Task Phase 1 and blocks all user-story documentation.
- **Task Phase 3 (User Story 1)**: Depends on Task Phase 2; independently reviewable as the MVP.
- **Task Phase 4 (User Story 2)**: Depends on Task Phase 2; can proceed in parallel with Task Phase 3.
- **Task Phase 5 (User Story 3)**: Depends on Task Phase 2; contract and backlog work can start in parallel, while final traceability depends on the completed Task Phase 3 and Task Phase 4 artifacts.
- **Task Phase 6 (Polish and gate)**: Depends on all desired user-story artifacts and is required before PRD Phase 2.

### User Story Dependencies

- **User Story 1 (P1)**: Depends only on Task Phase 2; no dependency on User Story 2 or User Story 3 for its independent review.
- **User Story 2 (P1)**: Depends only on Task Phase 2; no dependency on User Story 1 or User Story 3 for its independent review.
- **User Story 3 (P2)**: Core API, backlog, and assumptions tasks depend only on Task Phase 2; final traceability integrates the outputs of User Story 1 and User Story 2.

### Within Each User Story

- Shared contract rules precede story artifacts.
- Architecture and repository structure are documented before architecture acceptance review.
- Entity vocabulary precedes the ERD and workflow cross-links.
- API, backlog, and assumptions artifacts are created before final traceability.
- Artifact validation precedes human phase-gate review.

### Parallel Opportunities

- Setup tasks T002-T004 can run in parallel after T001 scope confirmation.
- Foundational contract tasks T006-T009 can run in parallel after T005 establishes the shared authority model.
- User Story 1 tasks T011 and T012 can run in parallel; T013-T015 then refine and review their outputs.
- User Story 2 tasks T017 and T019 can run in parallel with T016; T018, T020, and T021 depend on their respective source artifacts.
- User Story 3 tasks T022-T026 can run in parallel after the Foundational phase; T027 waits for the story artifacts.
- Final validation tasks T030-T032 can run in parallel only after T028-T029; T033 depends on all final validation evidence.

## Parallel Execution Examples

### User Story 1

```text
Task: T011 Create architecture.md with system boundaries and human decision points
Task: T012 [P] Create repository-structure.md with monorepo ownership boundaries
```

### User Story 2

```text
Task: T016 Create workflow.md with lifecycle and transition evidence
Task: T017 [P] Complete data-model.md with entities and relationships
Task: T019 [P] Create hse-validation-checklist.md with required human reviews
```

### User Story 3

```text
Task: T022 Complete contracts/api-outline.md with all API groups
Task: T023 [P] Create backlog.md with dependency-ordered delivery work
Task: T024 [P] Create assumptions-and-open-questions.md with named owners
Task: T025 [P] Complete contracts/integration-contract.md with SAP boundaries
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 Setup.
2. Complete Phase 2 Foundational safety and contract rules.
3. Complete Phase 3 User Story 1.
4. Review the architecture and repository boundary independently.
5. Stop and obtain product, architecture, HSE, and operations feedback before expanding scope.

### Incremental Delivery

1. Add User Story 2 to validate the domain, ERD, workflow, and HSE review boundary.
2. Add User Story 3 to finalize API, backlog, assumptions, and traceability.
3. Run the Phase 6 artifact validation and record human review outcomes.
4. Do not begin Phase 2 scaffolding until the Phase 1 gate is explicitly accepted.

## Notes

- Every task uses the required `- [ ] T###` checklist format and includes an exact file path.
- `[P]` appears only on tasks designed to touch independent files or independent sections.
- `[US1]`, `[US2]`, and `[US3]` map directly to the user stories in `spec.md`.
- No application implementation or executable test task is authorized by this feature.
- The PRD enumerates 17 initial permit states; all tasks and artifacts must use that count.
