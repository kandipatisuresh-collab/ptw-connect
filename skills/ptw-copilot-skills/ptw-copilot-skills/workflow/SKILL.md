---
name: enterprise-workflow-engineering
description: Configurable workflow and approval-engine guidance for PTW.
---

# Enterprise Workflow Skill

## Purpose
Implement a configurable state machine and approval engine.

## State management
Represent valid transitions explicitly. A transition should include:
- source state
- target state
- action
- allowed roles
- prerequisites
- validators
- audit event
- notifications

## Approval patterns
Support:
- sequential approval
- parallel approval
- conditional approval
- rejection
- send-back
- delegation
- escalation
- SLA timers

Approval requirements may depend on permit type, risk, plant, area, work category and isolation requirement.

## Rules
- Backend is authoritative.
- UI must not determine authorization.
- Store workflow definitions and instances separately.
- Make transitions atomic with audit creation.
- Prevent duplicate approval actions.
- Handle concurrency using optimistic locking or equivalent.
- Never allow an approval to bypass required safety prerequisites.

## Testing
Test every valid transition and every invalid transition. Test role restrictions, race conditions, rejection, re-submission, timeout and escalation.
