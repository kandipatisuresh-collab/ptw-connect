# Research: Enterprise Permit to Work Platform

## Decision 1: Use a modular web application with a replaceable SAP integration boundary

- **Decision**: Organize the product into responsive user experience, API/application services,
  domain workflow, PostgreSQL persistence, notifications, and a separate SAP adapter boundary.
- **Rationale**: PTW safety rules must remain testable without an SAP connection, while the SAP
  landscape and available services are installation-specific. The boundary permits synchronous
  lookups, asynchronous synchronization, retries, and future adapters without coupling permit
  decisions to vendor details.
- **Alternatives considered**: Direct SAP calls from permit screens were rejected because they
  make safety decisions dependent on external latency and make landscape changes expensive.
  A single undifferentiated application was rejected because it weakens ownership and testing
  boundaries.

## Decision 2: Treat permit lifecycle as a persisted, configurable state machine

- **Decision**: Store lifecycle definitions, transition prerequisites, role requirements, and
  status history separately from the current permit state. Enforce transitions in one domain
  service and record each accepted or rejected material action.
- **Rationale**: The specification requires configurable workflows while preventing invalid and
  unauthorized transitions. Immutable status history and explicit transition guards support audit
  review and safe concurrent actions.
- **Alternatives considered**: A collection of controller-level conditionals was rejected because
  rules would be duplicated and difficult to review. A free-form status field was rejected because
  it cannot reliably enforce safety prerequisites.

## Decision 3: Use a normalized relational model with immutable audit records

- **Decision**: Keep permits, configuration, safety records, approvals, isolations, attachments,
  notifications, integration transactions, and audit records in related tables with internal UUID
  identifiers and preserved SAP business identifiers.
- **Rationale**: The entities have clear relationships and require referential integrity, filtering,
  reporting, history, and access scope. Append-only audit records provide traceability without
  allowing normal UI edits to rewrite evidence.
- **Alternatives considered**: Storing the permit as one document was rejected because approvals,
  repeated gas tests, isolations, and audit history need independent querying and constraints.

## Decision 4: Use policy-driven authorization at every state-changing boundary

- **Decision**: Resolve user roles, permission, plant or area scope, assignment, and current
  transition prerequisites before allowing a state-changing action. Keep role and workflow rules
  configurable.
- **Rationale**: PTW actions are safety-sensitive and the same role may have different scope by
  site. Authorization must not depend only on whether a user can view a page.
- **Alternatives considered**: Frontend-only authorization was rejected because clients cannot be
  trusted. A fixed role matrix was rejected because the specification requires configurable roles
  and approval rules.

## Decision 5: Separate source maintenance context from PTW-owned data

- **Decision**: Store selected SAP reference identifiers and a sanitized source snapshot with source
  timestamps and synchronization status. Treat source fields as read-only by default and preserve
  the historical relationship when SAP data is unavailable or changed.
- **Rationale**: Permit records must remain auditable even if an SAP object is archived or temporarily
  unavailable. Outbound updates must be opt-in and limited to capabilities approved for the landscape.
- **Alternatives considered**: Copying SAP fields as editable PTW master data was rejected because it
  creates conflicting authorities. Requiring SAP availability for every permit view was rejected
  because safe review and closure must remain possible during outages.

## Decision 6: Use an explicit integration transaction and error model

- **Decision**: Assign a correlation ID to every external request or event and record sanitized
  request metadata, source object, timestamps, outcome, retry state, and reprocessing history.
- **Rationale**: This supports operational diagnosis and reliable synchronization without logging
  credentials or tokens. It also gives administrators a controlled error queue rather than silently
  dropping failed synchronization.
- **Alternatives considered**: Unstructured application logs alone were rejected because they cannot
  reliably support reprocessing or audit correlation.

## Decision 7: Phase delivery around the safest vertical slice

- **Decision**: Deliver foundation and authorization first, then permit creation and workflow,
  safety controls, field operations, SAP context, reporting, and optional offline capabilities.
- **Rationale**: The core permit lifecycle and safety gates provide value before advanced integrations
  and reporting. Each phase can be validated with focused unit, integration, contract, and end-to-end
  tests.
- **Alternatives considered**: Building dashboard or SAP synchronization first was rejected because
  neither delivers safe permit control without the domain and authorization foundation.

## Resolved Unknowns and Deferred Configuration

- Exact SAP OData or REST services remain landscape-specific and will be supplied by the SAP team;
  the plan resolves this by requiring a capability-based adapter contract rather than inventing URLs.
- Site retention, gas thresholds, offline command policy, approval delegation, and permit validity
  remain configurable policy inputs, not implementation assumptions.
- Identity, malware scanning, notification delivery, and device QR capabilities are external
  dependencies with explicit test doubles and failure behavior.
