---
name: "Permit to Work Enterprise Application"
description: "Use when designing or implementing the Permit to Work application, including React/TypeScript UI, Node.js APIs, PostgreSQL schema and migrations, workflow, risk and safety controls, isolation management, SAP S/4HANA PM integration, authentication, audit logging, reporting, tests, or deployment documentation."
applyTo:
  - "frontend/**"
  - "backend/**"
  - "database/**"
  - "integration/**"
  - "workflows/**"
  - "tests/**"
  - "docs/**"
  - "infrastructure/**"
---

# Permit to Work Application Instructions

## Product Context

Build a production-ready digital Permit to Work platform for industrial and oil and gas operations. It must manage the full permit lifecycle, provide real-time operational visibility, integrate with SAP S/4HANA Plant Maintenance through an adapter, and remain suitable for desktop, tablet, and mobile field use.

The primary entities and capabilities are permits, configurable permit types, risk assessments, safety checklists, gas tests, isolations, approvals, attachments, notifications, audit records, reports, and SAP PM references.

## Architecture

- Use TypeScript throughout the frontend, backend, integration, workflow, and tests.
- Keep the solution modular with clear boundaries between UI, API, domain services, persistence, workflow, notifications, and SAP integration.
- Use React with an enterprise component library for the frontend and Node.js REST APIs with OpenAPI documentation for the backend.
- Use PostgreSQL with normalized tables, UUIDs for internal identifiers where appropriate, preserved SAP business object numbers, foreign keys, indexes, unique constraints, timestamps, and migration scripts.
- Define interfaces before implementations for domain services and external integrations.
- Prefer existing project patterns and small focused modules. Do not generate the application as one large file or introduce dependencies without a clear need.
- Keep environment-specific configuration externalized. Never commit secrets or hard-code credentials.

## Permit Domain and Workflow

- Treat permit workflow as a configurable state machine. Enforce valid transitions in the domain layer and reject invalid transitions through the API.
- Support the lifecycle states defined by the product: `DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `SAFETY_REVIEW`, `ISOLATION_PENDING`, `APPROVAL_PENDING`, `APPROVED`, `ISSUED`, `ACTIVE`, `SUSPENDED`, `RESUMED`, `EXTENSION_REQUESTED`, `EXPIRED`, `CLOSURE_PENDING`, `CLOSED`, and `CANCELLED`.
- Keep permit types, approval rules, checklist definitions, PPE requirements, isolation types, gas limits, validity periods, notification templates, risk matrices, plants, and areas configurable rather than hard-coded.
- Enforce authorization for every lifecycle command. Model the required roles and permissions as configurable RBAC, including requester, issuer, area authority, performing authority, maintenance planner and supervisor, safety officer, isolation authority, approver, administrators, and auditor.
- Require additional approval for high and critical residual risks. Calculate risk score as likelihood multiplied by severity using a configurable matrix.
- Require mandatory safety checklist items before submission and validate permit-specific requirements, including gas testing and isolations where applicable.
- Preserve SAP order, notification, equipment, functional location, operation, and work center references without treating SAP data as editable PTW master data unless explicitly configured.

## SAP PM Integration

- Isolate SAP-specific behavior behind interfaces and adapters such as notification, maintenance order, operation, equipment, functional location, and work center services.
- Do not fabricate SAP endpoints, assume a specific S/4HANA release, or couple permit business logic directly to an SAP client. Document the SAP services and landscape mappings that the SAP team must configure.
- Support synchronous lookups and asynchronous synchronization/events through an integration layer. Use correlation IDs for every transaction.
- Log integration metadata such as request ID, SAP object, timestamps, status, and sanitized error details. Never log access tokens, passwords, cookies, or other secrets.
- Make outbound PTW-to-SAP updates opt-in and capability-driven. Do not update SAP objects unless the configured SAP API and business process explicitly support the operation.
- Implement retry, error queue, reprocessing, and synchronization checkpoints for master data and SAP PM objects.

## Security and Auditability

- Design for OAuth 2.0/OIDC with Microsoft Entra ID compatibility, backend authorization, least privilege, secure headers, input validation, rate limiting, CSRF protection where applicable, and safe error responses.
- Use parameterized queries or a trusted ORM/query builder. Validate request bodies, query parameters, uploaded files, and state-changing commands at the API boundary.
- Do not expose stack traces or confidential permit details to unauthorized users. Protect attachment downloads and QR verification responses with authorization.
- Audit every material action, including creation, edits to safety data, submissions, decisions, issue, suspension, resumption, extension, closure, cancellation, integration actions, and attachment access. Capture actor, role, action, before/after values when relevant, timestamp, session/IP metadata where permitted, and correlation ID.
- Treat audit records as append-only from the application UI. Use immutable status history for permit transitions.
- Store files through a secure storage abstraction with size/type validation and a malware-scanning integration point.

## API and Error Conventions

- Expose resource-oriented REST endpoints for permits, lifecycle commands, audit/workflow views, SAP searches, reports, and configuration.
- Keep lifecycle commands explicit and idempotency/concurrency behavior deliberate. Prevent lost updates on approvals, issue, suspend, resume, extend, and close operations.
- Return a consistent error shape containing an application error code, safe message, correlation ID, and timestamp. Keep internal diagnostics in protected logs.
- Document public APIs with OpenAPI and keep request/response types aligned between backend and frontend.

## Frontend and Mobile UX

- Build task-oriented screens for permit creation, review, risk assessment, checklist completion, gas testing, isolation verification, approvals, active permit monitoring, QR verification, and closure.
- Use responsive layouts that work on desktop, tablet, and mobile. Keep critical actions accessible for field users and support photo/file capture where the platform allows it.
- Use clear status, risk, validity, and authorization indicators. Make destructive or safety-critical actions explicit and confirmable.
- Use accessible labels, keyboard navigation, sufficient contrast, validation messages, loading states, empty states, and error recovery.
- Avoid exposing confidential information in unauthenticated QR verification. Do not invent a marketing landing page when the requested surface is an operational application.

## Testing and Delivery

- Add focused unit tests for risk calculations, authorization, transition rules, validation, and SAP adapters.
- Add integration tests for persistence, authentication/authorization, API contracts, notifications, and SAP integration boundaries.
- Add end-to-end coverage for the core permit path from creation through SAP reference, risk and checklist completion, isolation, approval, issue, activation, suspension/resumption, and closure, including invalid transitions.
- Update relevant architecture, API, database, workflow, security, SAP integration, deployment, and testing documentation as behavior is added.
- Work incrementally: establish architecture and interfaces, implement the smallest vertical slice, add tests, validate migrations and APIs, then expand into adjacent modules.
- Before declaring a feature complete, run the narrowest relevant test, typecheck, lint, migration check, or API contract validation available, and report any unavailable external SAP or identity dependencies honestly.
