<!--
Sync Impact Report
- Version change: unratified placeholder -> 1.0.0
- Modified principles: none; all five principles are newly established
- Added sections: Product and Architecture Constraints; Development and Quality Gates
- Removed sections: none
- Follow-up TODOs: RATIFICATION_DATE requires confirmation by the project owners
-->

# Permit to Work Enterprise Application Constitution

## Core Principles

### I. Safety-Critical Domain Integrity
The system MUST model permit lifecycle, risk, checklist, gas-testing, isolation,
approval, issue, suspension, resumption, extension, expiry, and closure as explicit
domain behavior. Invalid state transitions and unauthorized safety actions MUST be
rejected at the domain and API boundaries. Configurable rules MUST be used for permit
types, risk matrices, checklists, approvals, gas limits, isolation types, and validity
periods. This protects workers by making safety controls enforceable and reviewable.

### II. Modular and Adapter-Based Architecture
The application MUST use TypeScript with clear boundaries between frontend, REST API,
domain services, workflow, persistence, notifications, and integrations. External
systems MUST be accessed through interfaces and replaceable adapters. SAP-specific
behavior MUST remain behind an integration layer and MUST NOT be coupled directly to
permit business logic. This enables independent testing, controlled change, and
support for different SAP landscapes without fabricating APIs.

### III. Security, Least Privilege, and Privacy
All protected operations MUST enforce OAuth 2.0/OIDC-compatible authentication,
configurable RBAC, least privilege, input validation, secure error handling, and
appropriate rate, header, CSRF, and upload protections. Secrets MUST remain outside
source code and logs. Attachments, QR verification, permit details, and SAP data MUST
be disclosed only to authorized users. This is mandatory because PTW data can expose
industrial hazards, personnel information, and operationally sensitive assets.

### IV. Auditability and Operational Observability
Every material permit, approval, safety, isolation, attachment, notification, and SAP
integration action MUST produce an immutable or append-only audit record with actor,
role, action, timestamp, correlation ID, and relevant before/after values. Integration
transactions MUST record sanitized request metadata, outcome, and error details while
excluding credentials and tokens. APIs MUST return a consistent safe error shape with
a correlation ID. These records support incident review, regulatory evidence, and
reliable field operations.

### V. Incremental Delivery and Verifiable Quality
Every feature MUST be implemented in small, reviewable increments with interfaces,
focused tests, documentation, and the narrowest relevant validation. Unit tests MUST
cover risk calculations, authorization, and workflow transitions; integration tests
MUST cover persistence, API contracts, authentication boundaries, notifications, and
SAP adapters; end-to-end tests MUST cover the core permit lifecycle and invalid
transitions. Complexity and dependencies MUST be justified by a concrete requirement.
This keeps a safety-critical product understandable and deployable.

## Product and Architecture Constraints

The product MUST support responsive desktop, tablet, and mobile workflows for permit
creation, review, approval, checklist completion, gas testing, isolation verification,
QR verification, suspension, resumption, and closure. PostgreSQL MUST be used with
normalized schema design, keys, constraints, indexes, audit fields, and migrations.
REST APIs MUST be documented with OpenAPI. Environment-specific configuration and
enterprise secret management MUST be used; SAP credentials MUST never be hard-coded.
Outbound SAP updates MUST be opt-in and capability-driven, and synchronization MUST
provide correlation IDs, retries, error handling, and reprocessing where applicable.

## Development and Quality Gates

Each change MUST identify its affected domain rules, authorization decisions, audit
events, API contracts, migrations, and documentation. Code review MUST verify that
configuration has not been hard-coded, safety-critical transitions are guarded, and
confidential data is not exposed. A change MUST NOT be considered complete until its
focused automated checks pass and unavailable external dependencies, including SAP,
identity, malware scanning, or notification providers, are explicitly documented.
Production deployment MUST use reviewed migrations, protected configuration, rollback
planning, and operational monitoring.

## Governance

This constitution is the highest-level project governance document for the PTW
application. It supersedes conflicting process guidance unless an approved amendment
explicitly changes it. Amendments MUST document the motivation, affected principles,
compatibility impact, migration or rollout consequences, and required documentation
updates. Project owners MUST review and approve amendments before implementation work
that depends on the changed rule begins.

The constitution uses semantic versioning: MAJOR for incompatible principle removal or
redefinition, MINOR for a new principle or materially expanded governance requirement,
and PATCH for clarifications or non-semantic wording changes. Every pull request and
release review MUST check compliance with these principles and record any accepted
exception, its owner, scope, expiry, and compensating controls. Exceptions MUST NOT
weaken legally required or safety-critical controls.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm original adoption date | **Last Amended**: 2026-09-20
