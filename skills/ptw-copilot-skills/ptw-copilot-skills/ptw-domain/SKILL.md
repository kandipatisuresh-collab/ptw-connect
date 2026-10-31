---
name: industrial-ptw-hse-domain
description: Domain guidance for enterprise Permit to Work systems in industrial and oil & gas environments.
---

# Industrial PTW / HSE Domain Skill

## Purpose
Build configurable, auditable Permit to Work processes. Treat this as a safety-critical business domain: never invent company-specific HSE rules. Represent local procedures as configuration.

## Core concepts
Support permit types such as Hot Work, Cold Work, Confined Space, Electrical, Excavation, Work at Height, Line Breaking, Lifting and General Maintenance.

Typical lifecycle:
DRAFT -> SUBMITTED -> UNDER_REVIEW -> SAFETY_REVIEW -> ISOLATION_PENDING -> APPROVAL_PENDING -> APPROVED -> ISSUED -> ACTIVE -> SUSPENDED/RESUMED -> CLOSURE_PENDING -> CLOSED
Also support CANCELLED and EXPIRED where authorized.

## Safety controls
Support:
- JSA/JHA and risk assessment
- hazards, controls and residual risk
- PPE
- gas testing
- isolation / LOTO
- fire watch
- confined-space controls
- emergency arrangements
- SIMOPS
- attachments and evidence

Risk scoring must be configurable. Do not hard-code thresholds unless explicitly approved by the business.

## Rules
- Enforce authorization server-side, not only in the UI.
- Prevent invalid state transitions.
- Require mandatory checklist items before relevant transitions.
- High/critical risk can trigger configurable additional approvals.
- Every material action must be audited.
- Permit validity and extension rules must be configurable.
- Never silently weaken a safety control to make a workflow pass.

## Output expectations
When generating code, identify assumptions and place company-specific rules in configuration tables/services.
