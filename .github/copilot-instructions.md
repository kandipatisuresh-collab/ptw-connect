# PTW Connect Copilot Instructions

## Scope and source of truth

This repository builds **PTW Connect**, an enterprise Permit-to-Work application for a safety-critical process. Treat `prd.md` as the product requirements source of truth. Keep implementation changes aligned with the PRD and record material assumptions or deviations in `docs/assumptions-and-open-questions.md`.

Work incrementally. Do not generate the whole application as one unstructured change. Before changing code, identify the owning module, the relevant requirement, the smallest testable increment, and the validation command. Keep unrelated refactors out of the change.

## Safety boundary

PTW Connect supports competent human decision-making; it does not replace it. Never add behavior that:

- autonomously decides that work is safe;
- automatically approves, authorizes, activates, suspends, extends, hands back, or closes a permit;
- bypasses required human review, isolation verification, gas-test acknowledgment, or segregation-of-duties controls; or
- treats a UI-only check as authorization.

Every safety-critical action must be performed by an authenticated, authorized user on the server. The UI and documentation must clearly state this limitation. When a requirement is ambiguous, preserve human review and fail closed until an authorized HSE or operations representative resolves it.

## Delivery phases

Follow the phase order in `prd.md`:

1. Architecture, assumptions, repository structure, backlog and acceptance criteria, diagrams, database ER model, and OpenAPI outline. No business code.
2. Backend/frontend scaffolding, MySQL/Flyway, Docker Compose, health checks, and development-only mock authentication.
3. Users, roles, plant/location authorization, and master data.
4. Permit creation, risk assessment, attachments, and validation.
5. Configurable workflow, approvals, notifications, and immutable audit history.
6. Isolation, gas testing, issue/activation, suspension, extension, handback, closure, and shift handover.
7. SAP gateway ports, mock adapter, and configurable adapter skeletons.
8. Dashboards, reports, and integration monitoring.
9. Automated tests, security controls, documentation, and deployment hardening.

At the start of each phase, state the files to be created or modified, assumptions, and risks. Implement the smallest working increment, run the applicable build/lint/tests, fix failures in the touched slice, and update documentation. Do not start a later phase until the prior phase artifacts are complete and validated. The current PRD request is Phase 1 only unless the user explicitly changes scope.

## Target repository structure

Preserve this monorepo layout:

```text
frontend/       React + TypeScript + Vite application
backend/        Java 21 + Spring Boot 3 Maven service
database/       MySQL 8 schema and Flyway migrations
integration/    Integration contracts, mappings, and support assets
deployment/     Docker, Kubernetes/Helm, and environment deployment assets
docs/           Architecture, security, domain, operations, and test docs
.github/        Copilot instructions and CI workflows
docker-compose.yml
README.md
.env.example
```

Keep frontend, backend, database, integration, and deployment ownership clear. Do not expose persistence entities directly through REST APIs; use validated request and response DTOs.

## Technology and architecture rules

- Frontend: React, TypeScript, Vite, Material UI, React Hook Form, Zod, TanStack Query, and responsive WCAG 2.2 AA design.
- Backend: Java 21, Spring Boot 3, Spring Web, Spring Data JPA, Spring Security, Bean Validation, Actuator, Flyway, MapStruct, and Lombok only when it improves clarity.
- Database: MySQL 8 with version-controlled Flyway migrations, UTC timestamps, foreign keys, indexes based on real queries, optimistic locking, and immutable audit/workflow history.
- Identity: Microsoft Entra ID with OAuth 2.0/OIDC and JWT bearer validation. A mock identity provider is development-only. Never store PTW user passwords.
- Workflow: database-driven and configurable. Do not hard-code approvers. Resolve routing from configured plant, location, permit type, business unit, risk, work category, role, approval level, delegation, and escalation rules.
- Integrations: use ports and adapters. Keep external URLs, entity names, field mappings, authentication, and version details configurable and unverified until confirmed against customer metadata.
- Notifications: use an outbox and retry mechanism. A notification failure must not roll back or lose the workflow transaction.

Prefer existing repository patterns and standard library/framework facilities. Add an abstraction only when it clarifies a real boundary or is required by the PRD.

## Workflow and authorization invariants

Enforce these rules server-side and test them explicitly:

- Every transition validates authenticated identity, role, plant/location authorization, current state, mandatory data, and segregation of duties.
- State transitions use optimistic locking and idempotency keys to prevent duplicate or concurrent actions.
- Rejection and return-for-correction require comments.
- Self-approval is prohibited whenever configured and must be covered by a negative test.
- Approval is not activation. Permit Issuer and Permit Receiver must complete required toolbox-talk acknowledgments and all mandatory checks before activation.
- A permit cannot activate without required isolation verification, mandatory gas testing, or valid dates.
- Extensions trigger configurable risk reassessment and reapproval rules.
- Closed permits are immutable except through a controlled, auditable amendment process.
- Record actor, authentication identity, timestamp, old state, new state, comments, IP address, correlation ID, and action outcome for workflow actions.
- Never trust client-supplied authorization, status, actor, timestamps, risk decisions, or plant/location scope.

Use explicit state names from the PRD and make transition rules configurable where the business rule is site-specific.

## SAP integration rules

Define and preserve a `MaintenanceOrderGateway` port with adapters for S/4HANA OData, ECC OData, Integration Suite, and synthetic mock data. The proposed canonical maintenance-order fields in the PRD are not claims about any specific SAP API.

- Do not invent SAP endpoints, entity fields, metadata, or status semantics.
- Do not allow browser-to-SAP calls; route all SAP access through the secured backend or approved integration layer.
- Do not expose SAP credentials or tokens to the frontend or logs.
- Support configurable OAuth 2.0, mTLS, principal propagation, or another approved enterprise method. Basic authentication is local-development-only and disabled by default.
- Include timeout, retry with exponential backoff and jitter, circuit breaking, pagination, URL encoding, correlation IDs, idempotency, dead-letter/manual reprocessing, structured errors, and integration audit history.
- Never overwrite PTW-controlled fields during synchronization. Show stale data and the last successful synchronization time.
- Treat actual SAP connectivity and metadata validation as a release prerequisite, not as complete merely because an adapter compiles.

Maintain the SAP documents required by the PRD, including the field-mapping template, connectivity checklist, and error-handling guidance.

## Security and privacy

Apply OWASP ASVS and OWASP API Security principles with deny-by-default, least privilege, and defense in depth:

- authorize every endpoint server-side using role plus plant/location scope;
- validate input with allow-lists and output with safe DTO serialization;
- use parameterized persistence access and protect against IDOR, mass assignment, SQL injection, XSS, SSRF, and CSRF where applicable;
- validate uploads by size, MIME type, extension, content signature where practical, and malware-scan status; never use a user-provided filename for storage;
- use CORS allow-lists, security headers, encrypted transport, secure token/session expiry handling, rate limiting, and redacted structured logs;
- return RFC 7807-style errors without stack traces, secrets, tokens, or confidential SAP payload fields;
- store attachment metadata and object-storage references, not binary files in MySQL;
- never hard-delete audit events or workflow history; implement legal hold and retention controls deliberately;
- keep secrets out of Git and obtain production secrets from an approved secrets manager;
- include dependency, secret, static, container, and SBOM checks in CI.

Classify data and document handling of personal, safety, operational, integration, and audit data. Use synthetic data only in tests, examples, seed data, and mock adapters.

## API conventions

Use REST under `/api/v1` with:

- standard HTTP status codes;
- RFC 7807-compatible problem responses;
- request/response DTOs rather than entities;
- pagination, sorting, and filtering for collections;
- correlation IDs on requests and audit/integration records;
- idempotency support for commands that change state;
- consistent validation and error field formats; and
- OpenAPI documentation kept synchronized with behavior.

API authorization must be independent of frontend route visibility. Do not return data outside the caller's permitted plant or location.

## UI conventions

Build accessible, responsive desktop/tablet experiences with Material UI. Every important state must be understandable without color alone and must include loading, empty, error, validation, and unsaved-change states. Critical actions require confirmation and, where relevant, a mandatory reason or comment.

Prominently show permit number, status, plant, location, risk, SAP order, validity period, and current approver. Show user timezone and plant timezone whenever dates could be ambiguous. Display the human-review safety limitation in the application. QR codes may contain only a non-sensitive permit reference or secure URL.

Keep authorization and safety decisions on the server; frontend validation improves usability but is never a security control.

## Database conventions

Use UUIDs for externally exposed identifiers. Add `created_at`, `created_by`, `updated_at`, `updated_by`, and a version column where appropriate. Store timestamps in UTC and store plant/site timezone separately. Use referential integrity and indexes driven by dashboard, workflow, authorization, and search queries. Use soft deletion only where legally and operationally appropriate. Make audit and workflow records append-only and tamper-evident by design.

Maintain normalized tables required by the PRD, including identity/authorization, master data, permits, activities, workers, risks, controls, isolations, gas tests, toolbox talks, workflow, notifications/outbox, SAP references/synchronization, audit, attachments, handover, extensions, suspensions, and idempotency. Keep synthetic seed data clearly marked as non-production.

## Testing and validation

Scale tests to the risk and blast radius of the change. Use unit, repository, service, controller, security, workflow, SAP contract, Testcontainers/MySQL integration, frontend component, Playwright end-to-end, accessibility, negative, concurrency, and idempotency tests as applicable.

Every safety-critical or state-changing feature must include tests for both the permitted path and the denied path. Maintain coverage for at least these scenarios:

- unauthorized plant access;
- requester self-approval;
- invalid current workflow state;
- concurrent approver actions;
- duplicate command/idempotency key;
- activation without isolation verification or mandatory gas test;
- expired permit activation;
- extension requiring risk reassessment;
- SAP timeout, authentication failure, and malformed data;
- notification failure without workflow transaction loss;
- prohibited attachment type;
- audit record creation; and
- modification of a closed permit.

After each edit, run the narrowest available focused test or compile/lint check first, then the relevant module suite. Do not claim a feature is complete without reporting what was actually executed and any remaining test or environment gap.

## Documentation and operational readiness

Update documentation with behavior that changed. Required documents include architecture, domain model, workflow, security, STRIDE threat model, SAP integration, API, database, deployment, operations runbook, testing, HSE validation checklist, and assumptions/open questions.

The HSE checklist must require competent HSE and operations representatives to validate permit types, hazard catalog, risk matrix, gas limits, isolation rules, approval levels, shift handover, extension, suspension/resumption, validity, legal/regulatory requirements, retention, and emergency procedures.

Provide Dockerfiles, local Docker Compose, health/readiness checks, environment placeholders, metrics, structured JSON logs, tracing configuration, Kubernetes/Helm starter assets, CI checks, backup/restore and disaster-recovery guidance, SAP-outage guidance, and notification-failure guidance. Never deploy automatically to production; require an approved environment gate.

## Completion standard

A task is complete only when the implementation, tests, authorization behavior, documentation, and operational impact are addressed for its scope. Report assumptions, files changed, validation performed, and remaining risks. Do not conceal uncertainty about HSE rules, legal requirements, customer SAP metadata, or deployment configuration; make it an explicit open question for the responsible human owner.
