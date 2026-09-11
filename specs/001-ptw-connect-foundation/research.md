# Phase 0 Research: PTW Connect Phase 1 Foundation

**Feature**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)
**Scope**: Documentation and contract design only. No executable behavior is introduced.

## Research Summary

The feature specification and constitution already prescribe the primary technology and
safety constraints. Research therefore resolves planning choices and records customer-
specific facts that must remain open rather than inventing them.

### Decision 1: Preserve the required monorepo ownership boundaries

**Decision**: Use `frontend`, `backend`, `database`, `integration`, `deployment`,
`docs`, and `.github` as separate ownership areas. Phase 1 places all deliverables under
the feature directory and records the future source tree without creating runtime code.

**Rationale**: The PRD requires this structure and the constitution requires clear
ownership, ports-and-adapters boundaries, and incremental delivery. It allows domain,
API, database, security, and deployment work to be reviewed without conflating their
responsibilities.

**Alternatives considered**:
- A single application folder was rejected because it obscures persistence, integration,
  deployment, and documentation ownership.
- A separate service for every bounded context was deferred because Phase 1 does not
  need runtime deployment topology and premature service boundaries add complexity.

### Decision 2: Keep Phase 1 documentation-only

**Decision**: Phase 1 produces architecture, backlog, acceptance criteria, domain/data
model, ERD, API outline, assumptions, and validation guidance only. It does not create
Spring, React, MySQL, Flyway, Docker, CI, adapter, or test-harness implementation.

**Rationale**: The PRD explicitly gates implementation behind Phase 1 review. This keeps
safety and domain decisions visible to HSE, operations, security, and architecture
reviewers before executable behavior exists.

**Alternatives considered**:
- Minimal scaffolding was rejected because it would start Phase 2 prematurely.
- A health endpoint was rejected because it provides no value to the Phase 1 design gate
  and could be mistaken for completed scaffolding.

### Decision 3: Use an explicit permit lifecycle with separate approval, issue, and activation

**Decision**: Model the 17 PRD states explicitly and keep `APPROVED`, `ISSUED`, and
`ACTIVE` distinct. State changes are represented as human commands with configured
preconditions and immutable workflow history.

**Rationale**: Separate states make it impossible to imply that approval automatically
starts work. They expose where toolbox talk, isolation verification, gas testing,
validity, and other mandatory checks must be completed by authorized people.

**Alternatives considered**:
- A simplified Draft/Approved/Active/Closed lifecycle was rejected because it hides
  safety evidence and segregation-of-duties checkpoints.
- An arbitrary any-to-any state graph was rejected because it increases bypass risk and
  makes review and test coverage harder.
- Full event sourcing was deferred; append-only relational workflow history is easier to
  review in the Phase 1 MySQL-oriented design.

### Decision 4: Make authorization server-derived and scope-aware

**Decision**: Every state-changing command must resolve identity, roles, delegation,
plant/location authorization, current state, mandatory evidence, and segregation-of-
duties rules on the server. Client-supplied actor, role, status, timestamps, risk
outcome, or scope are never authoritative.

**Rationale**: This directly implements constitution principles I and II and protects
against IDOR, mass assignment, self-approval, replay, and cross-plant data exposure.
Authorization policy is documented as a contract now and implemented later.

**Alternatives considered**:
- UI-only checks were rejected because they are not authorization controls.
- Client-supplied actor or role fields were rejected because the client is untrusted.
- A separate authorization microservice was deferred; it is not needed to define the
  Phase 1 contract and would add deployment complexity before runtime needs are known.

### Decision 5: Store site rules as configuration and fail closed when absent

**Decision**: Permit types, hazard and control catalogs, risk matrices, gas limits,
isolation types, approval matrices, workflow routing, delegations, shifts, and holiday
calendars are configurable concepts. Missing or incomplete safety configuration blocks
the relevant workflow action until an authorized owner resolves it.

**Rationale**: The PRD explicitly says site rules are not universal. A fail-closed
contract prevents candidate values from becoming accidental safety decisions.

**Alternatives considered**:
- Hard-coded role, permit, gas, and risk enumerations were rejected because they cannot
  represent site variation and violate the constitution.
- Silent defaults were rejected because an unreviewed default can be interpreted as a
  safety approval.

### Decision 6: Use append-only workflow and audit history with server evidence

**Decision**: Workflow history records every state-changing action with old/new state,
authenticated identity, resolved actor and role context, UTC timestamp, comments,
source address, correlation ID, idempotency key, outcome, and action type. Audit events
cover login/access, controlled changes, attachment access, integration, notification,
and administration events. Existing history is never updated or hard-deleted.

**Rationale**: This creates a reviewable evidence trail and supports investigations,
retention, legal hold, and tamper-evident operational controls.

**Alternatives considered**:
- A single unstructured event log was rejected because workflow queries and transition
  evidence need a dedicated contract.
- Hard deletion or mutable history was rejected by the PRD and constitution.
- Application-local timestamps were rejected because UTC avoids timezone and DST
  ambiguity.

### Decision 7: Define API contracts with DTOs, safe errors, and replay controls

**Decision**: The outline uses `/api/v1`, request/response DTOs, standard HTTP outcomes,
RFC 7807-compatible problem responses, pagination/filtering/sorting for collections,
correlation IDs, authenticated scope checks, and idempotency keys for commands.
Long-running SAP synchronization and notification work returns a correlation reference
for status tracking.

**Rationale**: These conventions are required by the PRD and constitution and create a
stable boundary without exposing database entities or secrets.

**Alternatives considered**:
- Direct entity serialization was rejected because it increases mass-assignment and data
  leakage risk.
- GraphQL was not selected for Phase 1 because the PRD specifies versioned REST and the
  authorization scope is easier to review endpoint by endpoint.

### Decision 8: Treat SAP canonical data as proposed and metadata-dependent

**Decision**: The proposed `MaintenanceOrder` fields are documented as a canonical
working model, not as claims about any SAP product or customer API. Endpoints, entity
sets, mappings, authentication, status semantics, and communication arrangements remain
configuration placeholders until validated against customer metadata.

**Rationale**: SAP APIs vary by product, version, configuration, and customer extension.
The constitution prohibits invented endpoints or fields and makes metadata validation a
release prerequisite.

**Alternatives considered**:
- Assuming the proposed fields match S/4HANA or ECC was rejected.
- Browser-to-SAP communication was rejected by the PRD and security boundary.
- A complete adapter implementation was deferred to Phase 7.

### Decision 9: Use contract-first validation for Phase 1

**Decision**: Validate this phase with structural checks, requirements traceability,
Mermaid source review, contract consistency review, and explicit HSE/operations/security
sign-off prompts. The quickstart provides shell-level checks that are runnable without a
runtime application or customer SAP environment.

**Rationale**: Phase 1 has no executable business code. Artifact-level checks provide
meaningful evidence while keeping the phase gate honest.

**Alternatives considered**:
- Runtime tests were rejected because there is no runtime to test in Phase 1.
- Visual-only review was rejected because required headings, contract coverage, and
  traceability can be checked mechanically.

### Decision 10: Classify data before implementation

**Decision**: Treat personal, safety, operational, integration, and audit data as
separate handling categories. Use synthetic data exclusively in Phase 1 examples,
diagrams, seed data, and future tests until an approved classification decision allows
otherwise.

**Rationale**: The PRD and constitution require least privilege, redacted logs,
protected integration payloads, immutable audit history, and no production or personal
data in tests. Naming the categories now gives later API, database, security, and
retention designs a common vocabulary.

**Alternatives considered**:
- Treating all permit information as one classification was rejected because personal,
  safety, operational, integration, and audit data have different access and retention
  needs.
- Using realistic customer data in examples was rejected because it would create an
  unnecessary privacy and confidentiality risk before classification approval.

## Resolved Planning Unknowns

| Topic | Phase 1 decision | Validation owner and timing |
|---|---|---|
| Runtime implementation languages | Java 21 backend and TypeScript frontend are PRD constraints | Architecture review before Phase 2 |
| Database target | MySQL 8 with UTC timestamps, foreign keys, optimistic locking, and Flyway later | Database architect during Phase 2 |
| API style | Versioned REST under `/api/v1` with DTOs and RFC 7807-compatible errors | API/security review before Phase 2 |
| Permit states | Use the 17 named PRD states as the initial canonical vocabulary | HSE and operations before workflow implementation |
| Site permit catalog | Treat PRD list as candidate configuration, not universal truth | HSE and operations before master-data setup |
| Risk and gas limits | No unverified numeric default is authoritative; missing configuration blocks relevant action | HSE before safety-module implementation |
| Approval routing and SOD | Database-driven configuration with default-deny behavior when incomplete | Operations, HSE, and security before workflow implementation |
| SAP metadata and auth | Proposed canonical model only; no endpoint or field is considered validated | SAP integration owner before Phase 7 |
| Retention and legal hold | Model configurable retention and legal hold; do not select a legal period in Phase 1 | Legal/compliance before production design |
| Runtime scale and SLOs | Not defined by Phase 1; derive from approved operational volumes | Product and operations before performance testing |

## Research Conclusion

All planning unknowns have a documented decision or a named validation owner. No
customer-specific HSE, legal, identity, deployment, or SAP fact is presented as
confirmed. The design can proceed to the Phase 1 data model, contracts, and quickstart
without starting implementation.
