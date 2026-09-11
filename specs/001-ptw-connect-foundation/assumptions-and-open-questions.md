# PTW Connect Phase 1 Assumptions and Open Questions

This feature-local record summarizes the canonical repository record at
[`docs/assumptions-and-open-questions.md`](../../docs/assumptions-and-open-questions.md).
The root document is authoritative for material assumptions, deviations, unresolved HSE
or legal decisions, and unvalidated SAP details.

## Phase 1 Decisions

- Phase 1 defines architecture and contracts only; it does not authorize business code,
  database migrations, deployment, or external calls.
- Human approval, issue, activation, suspension, extension, handback, and closure are
  explicit authenticated and authorized actions. No action is automatic.
- Site-specific roles, permit types, hazards, controls, risk matrices, gas limits,
  isolation rules, workflow routes, shifts, and retention rules remain configurable.
- Missing safety configuration or evidence fails closed.
- Plant/location authorization, segregation of duties, idempotency, optimistic
  concurrency, UTC timestamps, and append-only history are mandatory design constraints.
- SAP canonical fields and integration metadata remain proposed until customer metadata,
  connectivity, authentication, mappings, and status semantics are validated.

## Data Classification and Handling

- **Personal data**: User identities, contact details, worker records, and access
  history require least-privilege access, redacted logs, approved retention, and
  authorized export only.
- **Safety data**: Risk assessments, hazards, controls, gas tests, isolations,
  toolbox-talk records, and permit decisions require controlled access, immutable
  history, and competent HSE/operations review.
- **Operational data**: Plants, locations, equipment, work scope, shifts, and permit
  status are restricted by server-enforced plant/location authorization.
- **Integration data**: SAP references, mappings, synchronization events, and
  notification records must exclude credentials, tokens, and confidential payloads.
- **Audit data**: Workflow history, audit events, attachment access, legal hold, and
  retention decisions are append-only and tamper-evident by design.
- **Synthetic data**: Examples, diagrams, seed data, and future tests use synthetic
  values only until an approved data-classification decision permits otherwise.

## Open Question Register

| ID | Question | Owner | Required evidence | Status |
|---|---|---|---|---|
| A-001 to A-002 | Which permit types, hazards, controls, PPE, and simultaneous-operation rules are approved for each site? | HSE and operations | Signed site master-data validation | Open |
| A-003 to A-005 | Which risk matrices, gas limits, retest rules, isolation types, and verification rules apply? | HSE and isolation authorities | Approved configuration and review record | Open |
| A-006 to A-007 | Which approval routes, segregation-of-duties rules, delegations, and identity claims are valid? | Operations, HSE, identity owner, security | Approved authorization/routing design | Open |
| A-008 to A-010 | Which handover, extension, suspension, resumption, validity, expiry, and timezone rules apply? | Operations and HSE | Approved workflow and calendar rules | Open |
| A-011 to A-012 | Which legal retention, legal hold, emergency, privacy, classification, and export rules apply? | Legal/compliance and privacy owner | Written compliance decision | Open |
| A-013 | Which notification channels, recipients, templates, retry, and manual-reprocessing responsibilities apply? | Operations/comms and security | Approved notification design | Open |
| A-014 to A-015 | Which SAP metadata, endpoints, entity sets, field mappings, authentication, status semantics, writable fields, and callback controls are valid? | SAP integration owner and customer SAP owner | Metadata inspection, connectivity test, mapping approval | Open and release-blocking for SAP |
| A-016 to A-017 | Which deployment, secrets, availability, volume, performance, backup, and recovery requirements apply? | Platform/DevOps, security, product, operations | Approved operational requirements | Open |
| A-018 | What is the original constitution ratification date? | Project owner | Historical approval record | Open |

No item in this register is an approved safety decision. See the root record for the
complete assumptions and gate policy.
