# Feature Specification: PTW Connect Phase 1 Foundation

**Feature Branch**: `001-ptw-connect-foundation`

**Created**: 2026-09-09

**Status**: Draft

**Input**: User description: `prd.md` and project constraints from `.specify/memory/constitution.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review the approved solution shape (Priority: P1)

As a product owner, HSE representative, operations representative, or technical reviewer,
I want a concise architecture and repository structure for PTW Connect,
so that I can confirm system boundaries, responsibilities, safety controls,
and delivery sequencing before business code is created.

**Why this priority**: The application supports a safety-critical process. Early review of
boundaries and human-control safeguards is necessary before implementation begins.

**Independent Test**: A reviewer can inspect the architecture and repository artifacts,
identify each major responsibility, trace the human approval boundary, and confirm that
Phase 2 work is not included.

**Acceptance Scenarios**:

1. **Given** the Phase 1 artifacts are available, **When** a reviewer examines the
   architecture description, **Then** the frontend, backend, database, integration,
   deployment, documentation, and CI ownership boundaries are identifiable.
2. **Given** the architecture describes safety-critical actions, **When** a reviewer
   traces approval, activation, suspension, extension, handback, and closure, **Then**
   each action is explicitly assigned to an authenticated and authorized human actor,
   with no autonomous safety decision represented.
3. **Given** a later implementation phase is listed, **When** a reviewer compares the
   Phase 1 scope with the PRD sequence, **Then** no business code or Phase 2 scaffolding
   is presented as complete.

---

### User Story 2 - Validate the domain and data foundation (Priority: P1)

As an HSE or operations domain reviewer,
I want the permit domain, workflow states, safety evidence, audit needs,
and data relationships represented clearly,
so that I can identify missing controls and validate the model against site practice.

**Why this priority**: Incorrect domain assumptions can create unsafe workflow gaps,
invalid authorization behavior, or unusable records later in the project.

**Independent Test**: A reviewer can trace a permit from creation through approval,
issue, activation, suspension, extension, handback, closure, and audit history using the
domain model and ER diagram, and can identify where isolation, gas testing, toolbox talk,
segregation of duties, and immutable history are represented.

**Acceptance Scenarios**:

1. **Given** the domain model and ER diagram, **When** a reviewer follows a permit’s
   lifecycle, **Then** the model identifies the permit, activities, people, hazards,
   controls, risk assessment, isolations, gas tests, toolbox talk, workflow, and audit
   evidence needed for the lifecycle.
2. **Given** configurable site rules are required, **When** a reviewer examines the
   model, **Then** permit types, risk matrices, gas limits, isolation types, approval
   routing, shifts, delegations, and authorizations are represented as configurable
   concepts rather than fixed site decisions.
3. **Given** a closed permit or workflow action, **When** a reviewer examines its data
   requirements, **Then** immutable history, actor identity, timestamps, outcome,
   comments, source address, and correlation information are accounted for.

---

### User Story 3 - Review the API and delivery backlog (Priority: P2)

As a delivery team member or security reviewer,
I want an API outline, prioritized backlog, acceptance criteria, assumptions,
and open questions,
so that later implementation can proceed in dependency order with explicit safety,
security, and domain decisions.

**Why this priority**: A shared contract and backlog reduce uncontrolled scope and make
later work reviewable without prematurely implementing business behavior.

**Independent Test**: A reviewer can select any Phase 1 backlog item, identify its
acceptance criteria, dependencies, owner boundary, assumptions, and validation evidence,
and trace the relevant API or domain contract where applicable.

**Acceptance Scenarios**:

1. **Given** the API outline, **When** a reviewer checks command and query boundaries,
   **Then** the outline identifies authenticated access, authorization scope,
   idempotency for state changes, correlation information, validation failures, and
   safe problem responses without exposing persistence records directly.
2. **Given** the prioritized backlog, **When** a reviewer orders the work by dependency,
   **Then** architecture and contracts precede scaffolding, identity, permits, workflow,
   safety controls, integration, reporting, and hardening.
3. **Given** an unresolved HSE, legal, site, or SAP question, **When** a reviewer checks
   the assumptions record, **Then** the question has an explicit owner or validation
   responsibility and is not silently treated as a confirmed business rule.

### Edge Cases

- The PRD names candidate permit types, gases, roles, workflow states, and SAP fields,
  but a site may not approve all of them. Phase 1 MUST label these as configurable or
  proposed and MUST avoid presenting them as universally valid.
- A permit may involve more than one plant, location, work category, hazard, activity,
  contractor, worker, isolation, gas reading, approval step, or notification. The model
  MUST support those relationships without assuming a single value.
- A state-changing request may be repeated or arrive concurrently. The API outline MUST
  identify idempotency and optimistic-concurrency expectations without implementing them.
- SAP may be unavailable, return malformed data, or expose different metadata than the
  proposed canonical model. The integration documentation MUST define this as a release
  prerequisite and an open validation dependency.
- Safety evidence may be incomplete, expired, rejected, or performed by an unauthorized
  person. The domain and workflow artifacts MUST show that activation cannot proceed
  until required human verification is complete.
- A closed permit may require a correction. The model MUST distinguish an immutable
  closed record from a controlled, auditable amendment process.
- The requester, approver, issuer, receiver, verifier, or closer may be the same person
  unless a configured segregation-of-duties rule prohibits that combination. The design
  MUST preserve the ability to enforce the configured prohibition server-side.
- A user may be authorized for one plant or location but not another. The API and
  authorization model MUST prevent cross-scope data exposure.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project MUST provide a Phase 1 architecture description that names
  system responsibilities, trust boundaries, human decision points, external-system
  boundaries, and ownership boundaries for the target monorepo.
- **FR-002**: The project MUST define the target repository structure for `frontend`,
  `backend`, `database`, `integration`, `deployment`, `docs`, `.github`, and root
  configuration artifacts without adding business implementation code.
- **FR-003**: The project MUST provide a Mermaid architecture view showing users,
  frontend, secured backend, database, notification boundary, object-storage boundary,
  identity provider, SAP boundary, and operational tooling. The diagram MUST show that
  browser clients do not call SAP directly.
- **FR-004**: The project MUST provide a domain model describing users, roles,
  authorizations, delegations, master data, permits, activities, workers, contractors,
  hazards, controls, risk assessments, isolations, gas tests, toolbox talks, workflow,
  notifications, SAP references, attachments, handovers, extensions, suspensions, and
  immutable audit history.
- **FR-005**: The project MUST provide a Mermaid database ER diagram covering the
  normalized entities required by the PRD, their key relationships, authorization scope,
  optimistic-locking points, UTC timestamp expectations, and append-only audit/workflow
  history boundaries.
- **FR-006**: The project MUST define the initial permit lifecycle states from the PRD
  and identify transition categories, required human roles, mandatory evidence,
  comments, authorization checks, segregation-of-duties checks, idempotency, and
  optimistic-concurrency expectations for each safety-critical transition.
- **FR-007**: The project MUST explicitly document that approval is not activation and
  that activation requires authorized human completion of configured toolbox-talk,
  isolation, gas-test, validity, and other mandatory checks.
- **FR-008**: The project MUST provide a prioritized Phase 1 backlog with acceptance
  criteria, dependencies, risks, and an explicit boundary preventing Phase 2 work from
  starting before Phase 1 artifacts are reviewed and validated.
- **FR-009**: The project MUST provide an OpenAPI outline under `/api/v1` covering the
  initial permit, workflow, identity/authorization, attachment, dashboard/reporting,
  SAP maintenance-order, synchronization, notification, audit, and health boundaries
  named by the PRD. The outline MUST use request/response contracts rather than expose
  persistence entities.
- **FR-010**: The API outline MUST define standard status outcomes, RFC 7807-compatible
  validation and authorization errors, pagination/filtering/sorting for collections,
  correlation identifiers, and idempotency requirements for state-changing commands.
- **FR-011**: The project MUST document the proposed canonical maintenance-order fields
  as unverified until customer SAP metadata is checked, and MUST identify configurable
  endpoints, entity names, mappings, authentication, pagination, retry, timeout,
  circuit-breaking, dead-letter, callback, and manual-reprocessing concerns.
- **FR-012**: The project MUST provide an assumptions and open-questions record covering
  site-specific HSE rules, legal and regulatory requirements, roles and approval levels,
  risk matrix, gas limits, isolation rules, validity, retention, emergency procedures,
  SAP metadata and connectivity, identity claims, notification channels, reporting
  expectations, and deployment constraints.
- **FR-013**: The project MUST identify data classifications and handling expectations
  for personal, safety, operational, integration, and audit data, including synthetic
  data requirements for examples and future tests.
- **FR-014**: The project MUST define Phase 1 acceptance criteria demonstrating that
  human review, server-side authorization, plant/location scope, segregation of duties,
  immutable auditability, secure integration boundaries, and no-autonomous-approval
  constraints are represented in every relevant artifact.
- **FR-015**: The project MUST record the validation performed for each Phase 1 artifact,
  including structural checks, diagram review, contract consistency review, and open
  risks that require human sign-off.

### Key Entities

- **User and authorization**: A person’s identity, roles, plant/location scope, active
  status, delegation, and substitute-approver relationships.
- **Organization and site master data**: Company, business unit, plant, functional
  location, equipment, work center, permit type, hazard, control, PPE, gas limit,
  isolation type, calendar, and shift definitions.
- **Permit**: A controlled work authorization record with status, validity, plant,
  location, risk, activities, personnel, contractor, equipment, SAP reference, and
  controlled lifecycle history.
- **Safety evidence**: Risk assessment, hazard/control relationship, isolation register,
  gas-test readings, toolbox-talk acknowledgments, attachments, and human confirmations.
- **Workflow**: Configurable definition, steps, instance, tasks, approval matrix,
  delegation, escalation, and immutable action history.
- **Integration record**: SAP system configuration, proposed maintenance-order reference,
  synchronization event, correlation identifier, stale-data marker, notification, and
  outbox/retry state.
- **Audit and handover**: Append-only audit event, attachment access event, controlled
  change evidence, shift handover, handover item, retention setting, and legal-hold
  indicator.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Before Phase 2 begins, 100% of the Phase 1 artifact set is present,
  internally linked, and reviewed against the PRD Phase 1 list: architecture,
  repository structure, backlog, acceptance criteria, domain/data model, ER diagram,
  OpenAPI outline, assumptions, and open questions.
- **SC-002**: A reviewer can trace each of the 17 initial permit states and every
  safety-critical action named in the PRD to a documented human actor, authorization
  check, required evidence, and immutable history requirement with no autonomous action
  remaining undocumented.
- **SC-003**: At least 95% of the Phase 1 acceptance-criteria checks can be completed by
  a reviewer using only the produced artifacts, without requiring business code or an
  unavailable external SAP environment.
- **SC-004**: A new reviewer can identify the owning repository area, dependency order,
  assumptions, and validation evidence for every Phase 1 backlog item within 30 minutes.
- **SC-005**: 100% of API operations in the outline that change state identify the
  required authenticated actor, authorization scope, idempotency expectation, conflict
  behavior, and audit outcome.
- **SC-006**: 100% of unresolved site-specific HSE, legal, identity, deployment, and
  SAP decisions are recorded as explicit open questions or assumptions with a named
  validation responsibility before implementation planning is approved.
- **SC-007**: HSE and operations reviewers can complete a structured review of permit
  types, hazards, risk matrix, gas limits, isolation rules, approval levels, handover,
  extension, suspension/resumption, validity, retention, legal requirements, and
  emergency procedures without interpreting undocumented defaults.

## Assumptions

- Phase 1 is an architecture and contract-definition increment only; it does not create
  executable frontend, backend, database, integration, deployment, or CI behavior.
- The PRD is the product source of truth, while the project constitution governs safety,
  authorization, security, evidence, and delivery behavior.
- Candidate roles, permit types, workflow states, gas fields, isolation types, and SAP
  fields in the PRD are proposed domain coverage and remain configurable or unverified
  until the responsible human owners validate them.
- The initial API outline uses `/api/v1`, authenticated human actors, scoped access,
  safe DTO contracts, RFC 7807-compatible problems, correlation identifiers, and
  idempotency for commands as project conventions.
- Plant and location authorization is additive and explicit; absence of authorization
  is treated as denial.
- Timestamps are represented in UTC, with plant/site timezone retained wherever a date
  or time may be ambiguous.
- Attachments are represented by validated metadata and an object-storage reference;
  binary content and malware-scanning implementation are deferred to later phases.
- Synthetic data is the only permitted data for examples, seed data, diagrams, and future
  automated tests until an approved data-classification decision states otherwise.
- Actual customer SAP metadata, connectivity, authentication, field mappings, and status
  semantics are unavailable during Phase 1 and cannot be claimed as validated.
- Competent HSE and operations representatives will validate safety rules before any
  implementation can be released for operational use.
- Production deployment, secrets, external notification configuration, legal retention,
  and emergency procedures require environment- and organization-specific approval.
- The target delivery team will select concrete implementation libraries and deployment
  mechanics during planning, provided they remain consistent with the PRD and constitution.
