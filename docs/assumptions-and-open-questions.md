# PTW Connect Assumptions and Open Questions

**Status**: Phase 1 design record; no decision below authorizes production use
**Source of truth**: `prd.md`, constrained by `.specify/memory/constitution.md`
**Feature detail**: `specs/001-ptw-connect-foundation/assumptions-and-open-questions.md`

This document is the repository-level record required by the project constitution.
Every material assumption, deviation, unresolved HSE or legal decision, and unvalidated
SAP detail must remain explicit here until the responsible human owner resolves it.

## Non-Negotiable Defaults

- PTW Connect supports competent human decision-making and does not replace it.
- No permit is automatically approved, authorized, issued, activated, suspended,
  extended, handed back, or closed.
- Missing or ambiguous safety configuration fails closed.
- Client-supplied actor, role, status, timestamp, risk decision, or plant/location scope
  is never authoritative.
- Candidate roles, permit types, hazards, controls, gas limits, isolation rules, risk
  matrices, approval routes, and SAP fields remain configurable or proposed until
  validated by the responsible owner.
- Only synthetic data may be used in examples, diagrams, seeds, and tests unless an
  approved data-classification decision states otherwise.

## Assumptions and Open Questions

| ID | Topic | Working assumption or safe default | Validation owner | Gate/status |
|---|---|---|---|---|
| A-001 | Permit types | The PRD list is a candidate catalog. Site-specific permit types are configurable and unavailable until approved. | HSE lead and operations lead | Required before master-data implementation; open |
| A-002 | Hazard and control catalog | Hazards, controls, PPE, and simultaneous-operations rules are site-configurable; no catalog entry is universally valid. | HSE lead | Required before risk-assessment implementation; open |
| A-003 | Risk matrix | Likelihood, severity, scoring, and HSE-review thresholds come from a versioned site configuration. Missing configuration blocks submission. | HSE lead and operations lead | Required before risk implementation; open |
| A-004 | Gas limits | Oxygen, LEL, H2S, CO, other gases, units, warning/blocking thresholds, and retest frequency require site approval. Missing limits block gas-test acknowledgment. | HSE lead and gas-testing authority | Required before gas-test implementation; open |
| A-005 | Isolation rules | Electrical, mechanical, process, and instrument isolation requirements, independent verification, de-isolation, and evidence rules are site-configurable. | HSE lead, operations lead, and isolation authorities | Required before isolation implementation; open |
| A-006 | Approval routing and SOD | Approval routes are selected from plant, location, permit type, risk, work category, role, sequence/parallel rules, delegation, and escalation. Incomplete routing and unspecified safety SOD rules deny the action. | Operations lead, HSE lead, and security architect | Required before workflow implementation; open |
| A-007 | Roles and identity claims | PRD roles are candidate role labels. Entra claims, group-to-role mapping, active-user lifecycle, and substitute-approver rules require customer identity-owner validation. | Identity owner and security architect | Required before authentication/authorization implementation; open |
| A-008 | Shift handover | Active and suspended permit handover, incoming/outgoing controller roles, acceptance, exceptions, and shift calendars are configurable by site. | Operations lead | Required before handover implementation; open |
| A-009 | Extension and suspension | Extension triggers, reassessment, reapproval, suspension reasons, and resumption checks are configurable. No extension or resumption is automatic. | HSE lead and operations lead | Required before lifecycle implementation; open |
| A-010 | Validity and time | Timestamps are stored in UTC, with plant/site timezone retained. Validity, expiry, grace periods, and server-time behavior require site approval. | Operations lead and HSE lead | Required before permit implementation; open |
| A-011 | Legal and regulatory requirements | Record retention, legal hold, audit immutability, emergency procedures, and amendment rules depend on applicable jurisdiction and company policy. | Legal/compliance owner | Required before production design; open |
| A-012 | Data classification and privacy | Personal, safety, operational, integration, and audit data require classification, access, retention, redaction, and export decisions. | Privacy/legal owner and security architect | Required before production design; open |
| A-013 | Notifications | Email, Teams, and other channels are gateway choices. Workflow transactions must commit independently from delivery, with outbox, retry, dead-letter, and manual reprocessing. | Operations/comms owner and security architect | Required before notification implementation; open |
| A-014 | SAP metadata and connectivity | Proposed MaintenanceOrder fields, OData entities, service URLs, mappings, statuses, authentication, CSRF behavior, and Integration Suite details are unverified placeholders. | SAP integration owner and customer SAP owner | Blocking release prerequisite for SAP integration; open |
| A-015 | SAP synchronization ownership | PTW-controlled status, approvals, safety evidence, and audit fields are never overwritten by SAP. Explicit mapping controls which fields may copy or refresh. | SAP integration owner and PTW product owner | Required before SAP implementation; open |
| A-016 | Deployment and secrets | Production secrets come from an approved secrets manager. Environment, transport, CORS, rate limits, observability, backup, recovery, and production gate require deployment-owner approval. | DevOps/platform owner and security architect | Required before deployment hardening; open |
| A-017 | Runtime scale and SLOs | Phase 1 does not select runtime volume or performance targets. Product and operations must provide approved user, plant, permit, audit, integration, and availability volumes before performance testing. | Product owner and operations lead | Required before performance design; open |
| A-018 | Constitution ratification date | The original adoption date is not present in the repository. It must be confirmed rather than inferred. | Project owner | Governance follow-up; open |

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

## Review Rule

A reviewer must not treat a working assumption as an approved safety rule. Changes to
HSE, legal, identity, authorization, retention, SAP, or deployment decisions must be
recorded with rationale, owner, date, evidence, and affected artifacts. Phase 2 remains
blocked until the required human reviews and decisions are recorded.
