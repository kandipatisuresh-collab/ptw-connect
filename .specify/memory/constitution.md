<!--
Sync Impact Report
Version change: uninitialized scaffold -> 1.0.0
Modified principles:
- Unresolved scaffold principle 1 -> I. Human-Controlled Safety-Critical Workflow
- Unresolved scaffold principle 2 -> II. Server-Enforced Authorization and Segregation of Duties
- Unresolved scaffold principle 3 -> III. Configurable Domain and Integration Boundaries
- Unresolved scaffold principle 4 -> IV. Testable Change and Safety Evidence
- Unresolved scaffold principle 5 -> V. Secure, Observable, and Auditable Operations
Added sections:
- Architecture and Product Constraints
- Delivery Workflow and Quality Gates
Removed sections: None
Follow-up TODOs:
- Confirm the original constitution ratification date.
- Obtain competent HSE and operations validation of site-specific safety rules.
- Validate SAP metadata, connectivity, mappings, and authentication with the customer.
-->

# PTW Connect Constitution

## Core Principles

### I. Human-Controlled Safety-Critical Workflow

PTW Connect MUST support competent human decision-making and MUST NOT replace it.
The system MUST NOT autonomously decide that work is safe or automatically approve,
authorize, activate, suspend, extend, hand back, or close a permit. Each safety-critical
action MUST be explicitly performed by an authenticated and authorized user on the
server. The application and its documentation MUST display this limitation. Ambiguous
safety rules MUST fail closed until resolved by an authorized HSE or operations owner.

### II. Server-Enforced Authorization and Segregation of Duties

Every endpoint and state transition MUST validate the authenticated identity, assigned
role, plant and location scope, current state, mandatory data, and configured
segregation-of-duties rules on the server. The server MUST ignore client-supplied
authorization, actor, timestamps, status, risk decisions, and scope. Self-approval MUST
be prohibited whenever configured. State-changing commands MUST use optimistic locking
and idempotency keys, and MUST record the actor, authentication identity, time, outcome,
comments, source address, and correlation ID.

### III. Configurable Domain and Integration Boundaries

Workflow routing, approval levels, delegation, escalation, permit types, hazards,
controls, risk matrices, gas limits, isolation rules, shifts, and site master data MUST
be configuration-driven where the PRD identifies site or organization variation.
Approvers MUST NOT be hard-coded in application code. External systems MUST be
accessed through ports and adapters; SAP endpoints, entity names, mappings, status
semantics, and authentication MUST remain configurable and unverified until confirmed
against customer metadata. Browser clients MUST NOT call SAP directly. Canonical models
MUST be identified as proposed until their external contract is validated.

### IV. Testable Change and Safety Evidence

Changes MUST be delivered in small, reviewable increments with a named owning module,
requirement, assumption, risk, and validation command. Safety-critical and state-
changing behavior MUST have tests for both permitted and denied paths, including
authorization scope, self-approval, invalid state, concurrency, idempotency, missing
isolation or gas-test evidence, expiry, extension reassessment, attachment validation,
integration failure, notification failure, audit creation, and closed-permit mutation.
Tests MUST use synthetic data and MUST NOT use production or personal data. A feature
MUST NOT be called complete until its executed checks and remaining gaps are recorded.

### V. Secure, Observable, and Auditable Operations

The system MUST apply deny-by-default, least privilege, defense in depth, OWASP ASVS,
and OWASP API Security practices. It MUST validate inputs and uploads, use safe DTOs,
parameterized persistence, secure error responses, security headers, CORS allow-lists,
appropriate CSRF protection, rate limits, redacted structured logs, and protected
integration boundaries. Secrets, tokens, credentials, stack traces, and confidential
payloads MUST NOT be committed, exposed to browsers, or logged. Audit and workflow
history MUST be append-only, tamper-evident by design, and retained under documented
legal-hold and retention controls. Health, metrics, tracing, retries, outbox state,
and integration failures MUST be observable without exposing sensitive data.

## Architecture and Product Constraints

PTW Connect MUST preserve the monorepo ownership boundaries for `frontend`, `backend`,
`database`, `integration`, `deployment`, `docs`, and `.github`. The frontend MUST use
React, TypeScript, Vite, Material UI, React Hook Form, Zod, and TanStack Query with
responsive WCAG 2.2 AA practices. The backend MUST use Java 21, Spring Boot 3, Spring
Web, Spring Data JPA, Spring Security, Bean Validation, Actuator, Flyway, and MapStruct;
Lombok is permitted only when it improves clarity. The database MUST use MySQL 8,
versioned Flyway migrations, UTC timestamps, foreign keys, query-driven indexes,
optimistic locking, and normalized tables. Persistence entities MUST NOT be exposed
directly through REST APIs.

Identity MUST use Microsoft Entra ID with OAuth 2.0/OIDC and JWT bearer validation in
production. Mock identity is development-only, and PTW MUST NOT store user passwords.
REST APIs MUST use `/api/v1`, standard status codes, RFC 7807-compatible problems,
pagination, sorting, filtering, correlation IDs, consistent validation errors, and
idempotency for state-changing commands. Attachments MUST store metadata and an
object-storage reference rather than binary content in MySQL. Notification delivery
MUST use an outbox and retry mechanism so delivery failure cannot lose workflow data.

The UI MUST make warning, error, pending, approved, active, suspended, and expired
states understandable without color alone. It MUST provide loading, empty, error,
validation, and unsaved-change states; keyboard navigation; critical-action
confirmation; mandatory reasons where required; permit identity and validity details;
user and plant timezones where dates are ambiguous; and only non-sensitive references
in QR codes. UI validation improves usability but MUST NOT be treated as authorization
or a safety control.

## Delivery Workflow and Quality Gates

Delivery MUST follow the PRD phases in order. Phase 1 is limited to architecture,
assumptions, repository structure, backlog and acceptance criteria, diagrams, the
database ER model, and an OpenAPI outline; it MUST NOT add business code. Each phase
MUST begin by naming files, assumptions, and risks, and MUST end with the smallest
working increment, focused build/lint/test results, fixed touched-slice failures,
updated documentation, and a summary of remaining work. A later phase MUST NOT begin
until the prior phase artifacts are complete and validated.

Required documentation MUST cover architecture, domain model, workflow, security,
STRIDE threats, data classification, SAP integration and mapping, API, database,
deployment, operations, testing, HSE validation, and assumptions/open questions.
CI MUST include applicable builds, tests, linting, dependency and secret scanning,
static analysis, container scanning, and SBOM generation. Production deployment MUST
require an approved environment gate and MUST NOT occur automatically.

## Governance

This constitution governs repository changes and takes precedence over conflicting
local practices, while `prd.md` remains the product requirements source of truth.
Every pull request or equivalent review MUST identify applicable principles, affected
requirements, authorization and safety impact, tests executed, documentation updated,
and unresolved risks. Reviewers MUST reject changes that weaken human review, server
authorization, auditability, or required evidence. Safety-rule changes require review
by competent HSE and operations representatives before release.

Amendments MUST be proposed with a written rationale, impact assessment, affected
requirements, migration or rollout plan where needed, and validation evidence. The
amendment MUST receive appropriate engineering and domain review before it is merged.
The constitution version MUST follow semantic versioning: MAJOR for incompatible
governance or principle removal/redefinition, MINOR for a new principle or materially
expanded governance, and PATCH for clarifications or non-semantic corrections. The
last-amended date MUST be updated for every accepted amendment. Compliance MUST be
reviewed at each phase gate and before production release, including explicit review
of HSE rules, legal requirements, customer SAP metadata, security controls, and
operational readiness.

Material assumptions, deviations, unresolved HSE or legal decisions, and unvalidated
SAP details MUST be recorded in `docs/assumptions-and-open-questions.md`. The original
ratification date is not present in the repository and requires project-owner
confirmation.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date not recorded | **Last Amended**: 2026-09-09
