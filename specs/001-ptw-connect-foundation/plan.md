# Implementation Plan: PTW Connect Phase 1 Foundation

**Branch**: `001-ptw-connect-foundation` | **Date**: 2026-09-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-ptw-connect-foundation/spec.md`

**Phase terminology**: In this plan, unqualified `Phase 1` and `Phase 2` refer to the
PRD delivery phases. The task list uses `Task Phase N` for its documentation-task
sequence.

## Summary

Phase 1 produces the reviewable architecture and contract foundation for PTW Connect.
It defines monorepo ownership, safety-critical permit lifecycle boundaries, the
conceptual domain and relational data model, API contracts, prioritized backlog,
assumptions, open questions, and validation evidence. It produces no executable
business code, migrations, application scaffolding, CI behavior, or external calls.

The design uses explicit human-controlled transitions, server-enforced authorization,
plant/location scope, configurable site rules, append-only workflow and audit history,
and ports-and-adapters boundaries for SAP and notifications. SAP canonical fields and
site-specific HSE rules remain proposed or unverified until their responsible owners
validate them.

## Technical Context

**Language/Version**: N/A for Phase 1; target implementation languages are Java 21
and TypeScript as prescribed by the PRD.

**Primary Dependencies**: Markdown, Mermaid diagrams, and an OpenAPI 3.x contract
outline for design artifacts. No runtime dependency is introduced in Phase 1.

**Storage**: Conceptual MySQL 8 schema with Flyway migration ownership deferred to
Phase 2; Phase 1 defines relationships, constraints, timestamps, and history boundaries.

**Testing**: Artifact validation, requirements traceability, diagram review, contract
consistency review, and manual HSE/operations/security review. Executable tests are
deferred because Phase 1 contains no business code.

**Target Platform**: Repository documentation consumed by product, HSE, operations,
security, architecture, and delivery reviewers.

**Project Type**: Documentation-only architecture and contract-definition increment
for a safety-critical enterprise web application.

**Performance Goals**: No runtime performance target applies to Phase 1. Later runtime
targets MUST be defined from approved operational volumes and user workflows.

**Constraints**: No business implementation; no autonomous safety decisions; no direct
browser-to-SAP calls; no unvalidated site rules; no persistence-entity exposure through
API contracts; synthetic data only; UTC timestamps; explicit authorization and audit
requirements; Phase 2 MUST NOT start before Phase 1 review and validation.

**Scale/Scope**: 15 functional requirements, 3 independently testable user journeys,
17 initial permit states, the PRD-required conceptual domain entities, the `/api/v1`
contract outline, and the Phase 1 repository/documentation structure.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The gate passes before research because this plan is limited to documentation and
contract design. It does not authorize safety decisions, implementation behavior,
external-system calls, or deployment.

- **Human control**: PASS. The plan documents authenticated human actors for every
  safety-critical action and preserves the approval-versus-activation boundary.
- **Server authorization and segregation of duties**: PASS. The contracts and data
  model require server-derived identity, role, plant/location scope, current-state
  checks, idempotency, optimistic concurrency, and configurable SOD checks.
- **Configurable boundaries**: PASS. Site rules are configuration-driven; SAP fields,
  endpoints, mappings, and status semantics remain proposed and unverified.
- **Testable change and safety evidence**: PASS. Every artifact has review criteria,
  traceability, assumptions, risks, and validation evidence; no executable code is
  introduced before the required phase gate.
- **Secure, observable, auditable operations**: PASS. The API outline uses DTO
  contracts, scoped access, RFC 7807-compatible errors, correlation IDs, and explicit
  append-only audit/workflow history requirements without exposing secrets.

**Gate decision**: PASS. Re-evaluate after `research.md`, `data-model.md`,
`contracts/`, and `quickstart.md` are complete.

### Post-Design Constitution Check

The Phase 1 design artifacts have been reviewed against the constitution and remain
within the approved scope.

- **Human control**: PASS. `data-model.md` and `contracts/authorization-contract.md`
  keep approval, issue, activation, suspension, extension, handback, and closure as
  explicit human commands. No artifact describes autonomous safety approval.
- **Server authorization and segregation of duties**: PASS. The authorization and API
  contracts require server-derived identity, role, plant/location scope, current state,
  evidence, SOD, idempotency, optimistic concurrency, and audit evidence.
- **Configurable boundaries**: PASS. Site rules are configurable and missing rules fail
  closed. `integration-contract.md` labels SAP fields and destinations proposed and
  requires customer metadata validation.
- **Testable change and safety evidence**: PASS. `quickstart.md` provides runnable
  artifact checks and the plan records manual HSE, operations, security, and SAP review
  dependencies. No executable business code was added.
- **Secure, observable, auditable operations**: PASS. DTO-only API contracts, scoped
  queries, RFC 7807-compatible problems, correlation IDs, redaction, outbox behavior,
  append-only history, and retention/legal-hold boundaries are documented.

**Post-design gate decision**: PASS for Phase 1 design. Phase 2 remains blocked until
  the required HSE, operations, security, legal/compliance, architecture, and customer
  SAP validation decisions are recorded.

### Phase 1 Reconciliation and Validation Evidence

On 2026-09-11, the implementation reconciliation verified the generated Phase 1
artifact set and recorded the following results:

- Architecture and repository boundary: [architecture.md](./architecture.md) and
  [repository-structure.md](./repository-structure.md).
- Domain, workflow, and HSE review: [data-model.md](./data-model.md),
  [workflow.md](./workflow.md), and [hse-validation-checklist.md](./hse-validation-checklist.md).
- API and integration contracts: [api-outline.md](./contracts/api-outline.md),
  [operation-contract-matrix.md](./contracts/operation-contract-matrix.md),
  [authorization-contract.md](./contracts/authorization-contract.md),
  [integration-contract.md](./contracts/integration-contract.md), and
  [audit-contract.md](./contracts/audit-contract.md).
- Delivery and governance records: [backlog.md](./backlog.md),
  [traceability.md](./traceability.md), [artifact-index.md](./artifact-index.md),
  [assumptions-and-open-questions.md](./assumptions-and-open-questions.md), and
  the repository-level [assumptions record](../../docs/assumptions-and-open-questions.md).
- Automated validation: artifact structure, JSON metadata, placeholder/scope scan,
  Mermaid source-block presence, 30-to-30 API/matrix parity, 17 lifecycle states,
  nine backlog rows, task syntax, and negative runtime-scope checks all passed.

Remaining blockers are human-owned: rendered architecture and ERD review, HSE and
operations validation, security and identity review, legal/privacy/retention review,
customer SAP metadata/connectivity approval, and confirmation of the constitution
ratification date. PRD Phase 2 scaffolding and MySQL setup remain blocked until the
phase-gate record is accepted.

## Project Structure

### Documentation (this feature)

```text
specs/001-ptw-connect-foundation/
├── plan.md              # This file
├── research.md          # Phase 0 research decisions
├── architecture.md      # System boundaries and Mermaid architecture view
├── repository-structure.md # Monorepo ownership and phase boundary
├── data-model.md        # Phase 1 conceptual data model and ER diagram
├── workflow.md           # Permit states, transitions, and evidence rules
├── hse-validation-checklist.md # Required HSE and operations review
├── backlog.md            # Dependency-ordered Phase 1-9 delivery backlog
├── assumptions-and-open-questions.md # Feature-local assumptions index
├── artifact-index.md     # Artifact, requirement, owner, and evidence index
├── traceability.md       # Requirement/story/artifact traceability
├── quickstart.md        # Phase 1 artifact validation guide
├── review-record.md      # Automated and human review evidence
├── contracts/           # Phase 1 API and interface contract outlines
│   ├── api-outline.md
│   ├── operation-contract-matrix.md
│   ├── authorization-contract.md
│   ├── integration-contract.md
│   └── audit-contract.md
├── checklists/
│   ├── requirements.md
│   └── phase-1-review.md
└── tasks.md             # Later output from /speckit-tasks
```

Repository-level governance artifact: `docs/assumptions-and-open-questions.md`.

### Source Code (repository root)
```text
backend/
├── src/main/java/...        # Phase 2+ application code
└── src/test/...             # PRD Phase 2+ backend tests

frontend/
├── src/
│   ├── components/          # PRD Phase 2+ shared UI
│   ├── pages/               # PRD Phase 2+ user journeys
│   └── services/            # PRD Phase 2+ API clients
└── tests/                   # PRD Phase 2+ frontend tests

database/
├── migrations/              # PRD Phase 2+ Flyway migrations
└── seeds/                   # PRD Phase 2+ synthetic non-production data

integration/
├── contracts/               # Gateway ports and external mappings
├── sap/                     # SAP adapters, Phase 7+
└── notifications/           # Notification adapters, Phase 5+

deployment/
├── docker/                  # PRD Phase 2+
└── kubernetes/              # PRD Phase 2+ starter assets

docs/
├── architecture.md
├── domain-model.md
├── workflow.md
├── security.md
├── threat-model.md
├── sap-integration.md
├── api.md
├── database.md
├── hse-validation-checklist.md
└── assumptions-and-open-questions.md

.github/
├── copilot-instructions.md
└── workflows/
```

**Structure Decision**: Use the PRD-required monorepo. Phase 1 creates and validates
documentation and contract artifacts under `specs/001-ptw-connect-foundation/` only.
The target source tree is recorded as a design boundary; PRD Phase 2 will create runtime
scaffolding after the Phase 1 gate passes.

## Complexity Tracking

No constitution violations require justification. The requested monorepo boundaries
come directly from the PRD and are being documented rather than implemented in this
phase.
