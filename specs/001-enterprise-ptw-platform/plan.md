# Implementation Plan: Enterprise Permit to Work Platform

**Branch**: `001-enterprise-ptw-platform` | **Date**: 2026-09-20 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-enterprise-ptw-platform/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Build a configurable digital Permit to Work platform that controls the full permit lifecycle,
requires risk, checklist, gas-test, isolation, and approval gates, supports field workflows and
reporting, and links permits to SAP PM maintenance context. The implementation will use a modular
TypeScript web architecture with a React client, Node.js REST services, PostgreSQL persistence,
explicit workflow and authorization services, and a replaceable SAP integration adapter.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x on Node.js 22 LTS; browser-targeted TypeScript for the client

**Primary Dependencies**: React, an enterprise component library, Node.js REST framework, OpenAPI
tooling, PostgreSQL driver or query builder, schema validation, OIDC client, structured logging,
QR generation/scanning, and test doubles for external services

**Storage**: PostgreSQL with normalized tables, migrations, indexes, effective-dated configuration,
UUID internal identifiers, preserved SAP business identifiers, and append-only audit/status history

**Testing**: Unit tests for domain rules and risk calculations; integration tests for persistence,
authorization, notifications, and SAP boundaries; contract tests for REST and SAP adapter behavior;
end-to-end tests for the core permit lifecycle and invalid transitions

**Target Platform**: Responsive desktop, tablet, and mobile web clients; containerized Node.js
services; managed PostgreSQL; enterprise identity and secret-management services

**Project Type**: Enterprise web application with API, workflow, database, integration, reporting,
and optional offline field capabilities

**Performance Goals**: At least 95% of authorized permit searches return within 3 seconds for
100,000 permits; lifecycle notifications arrive within 60 seconds in normal operation; safety
commands return a clear result without waiting indefinitely on SAP

**Constraints**: Deny-by-default authorization; no secrets in source or logs; invalid transitions,
missing mandatory controls, unverified isolations, and unauthorized access must be blocked; SAP
services and site policy values are landscape-specific; offline actions must be safe and conflict-aware

**Scale/Scope**: Initial organization with configurable plants and areas, 12 role families, 11
initial permit types, 16 lifecycle statuses, repeated safety evidence, and auditable reports

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Safety-Critical Domain Integrity**: PASS. Explicit transition prerequisites, configurable
  controls, and immutable status history are planned.
- **Modular and Adapter-Based Architecture**: PASS. Client, API, domain, persistence, workflow,
  notification, and SAP adapter boundaries are explicit.
- **Security, Least Privilege, and Privacy**: PASS. Authorization is enforced at state-changing
  boundaries, scope is part of policy evaluation, and secrets are protected.
- **Auditability and Operational Observability**: PASS. Material changes and integration failures
  have correlated append-only records and safe error responses.
- **Incremental Delivery and Verifiable Quality**: PASS. Delivery starts with a small vertical
  slice and assigns focused validation to each area.

No constitution violations require a complexity exception.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
frontend/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   │   ├── permits/
│   │   ├── safety/
│   │   ├── isolations/
│   │   ├── approvals/
│   │   ├── dashboard/
│   │   └── reports/
│   ├── services/
│   └── styles/
└── tests/

backend/
├── src/
│   ├── api/
│   ├── application/
│   ├── domain/
│   │   ├── permits/
│   │   ├── safety/
│   │   ├── workflow/
│   │   └── authorization/
│   ├── infrastructure/
│   │   ├── database/
│   │   ├── identity/
│   │   ├── notifications/
│   │   └── storage/
│   └── main.ts
└── tests/

database/
├── migrations/
├── seeds/
└── erd/

integration/
├── src/
│   ├── sap/
│   ├── notifications/
│   └── events/
└── tests/

workflows/
├── definitions/
└── tests/

tests/
├── contract/
├── integration/
└── e2e/

docs/
├── ARCHITECTURE.md
├── API.md
├── DATABASE.md
├── SAP-INTEGRATION.md
├── WORKFLOW.md
├── SECURITY.md
├── DEPLOYMENT.md
└── TESTING.md

infrastructure/
├── environments/
├── containers/
└── monitoring/
```

**Structure Decision**: Use separate `frontend`, `backend`, `database`, `integration`, `workflows`,
`tests`, `docs`, and `infrastructure` areas. Domain and workflow rules stay independently
executable from the UI and SAP adapter. Shared public behavior is documented in feature contracts.

## Complexity Tracking

No constitution violations are present; no complexity exception is required.

## Delivery Phases

### Phase 0: Foundation and research outcomes

- Establish environment configuration, logging redaction, correlation IDs, and test fixtures.
- Confirm SAP capabilities, identity claims, notification channels, storage/scanning dependencies,
  and site policy values through configuration records.
- Create interfaces for authorization, workflow, persistence, notification, storage, and SAP
  capabilities before concrete adapters.

### Phase 1: Core permit vertical slice

- Implement users, roles, permission scope, permit types, permits, status history, workflow tasks,
  and audit records.
- Deliver create, draft, view, search, submit, review, approve, issue, activate, suspend, resume,
  extend, and close behavior with explicit transition guards.
- Add safe errors, optimistic concurrency, idempotency, and focused tests.

### Phase 2: Safety controls

- Add risk assessments and configurable matrices, permit-specific checklists, and mandatory gates.
- Add gas testing, thresholds, instrument calibration validation, PPE, and safety notifications.
- Add isolation points, isolation lifecycle, certificates, verification, release, and issue gates.

### Phase 3: Field operations and controlled evidence

- Deliver responsive permit, approval, checklist, gas test, isolation, QR verification, attachment,
  suspension, resumption, and closure workflows.
- Add secure file handling, scanning integration, access control, upload/download auditing, and
  safe offline read access with explicitly allowed queued actions.

### Phase 4: SAP PM integration

- Implement capability-based notification, order, operation, equipment, functional location, and
  work center adapters using approved landscape mappings.
- Add source snapshots, read-only context, synchronization checkpoints, retry/error queue,
  correlation, and controlled reprocessing.
- Add outbound updates only for SAP processes approved by the SAP team.

### Phase 5: Visibility, reporting, and hardening

- Deliver dashboard, filtered search, operational/compliance reports, authorized exports, and audit
  views.
- Complete lifecycle, security, accessibility, responsive, migration, monitoring, and deployment
  validation.

## Post-Design Constitution Check

- **Safety-Critical Domain Integrity**: PASS. `data-model.md` defines lifecycle invariants and
  safety gates; `permit-api.md` requires them for every state-changing command.
- **Modular and Adapter-Based Architecture**: PASS. Contracts isolate SAP and external services;
  source layout separates domain, API, persistence, integration, and UI.
- **Security, Least Privilege, and Privacy**: PASS. Contracts require authorization, scope checks,
  safe QR views, redacted errors, protected attachments, and secret exclusion.
- **Auditability and Operational Observability**: PASS. The data model and event contract require
  correlated immutable evidence for actions and integration failures.
- **Incremental Delivery and Verifiable Quality**: PASS. Phases and `quickstart.md` define focused
  validation before expansion.

No post-design gate failures or unjustified complexity violations remain.
