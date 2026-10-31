---
name: enterprise-test-automation
description: Unit, integration, contract and end-to-end testing for PTW.
---

# Test Automation Skill

## Test layers
Use:
- unit tests for domain rules
- integration tests for database/services
- contract tests for SAP adapters
- API tests
- end-to-end tests for critical workflows

## Critical scenarios
Test:
Create -> Submit -> Review -> Safety Approval -> Isolation -> Approval -> Issue -> Activate -> Suspend -> Resume -> Close.

Also test:
- unauthorized transitions
- missing checklist items
- high-risk approval requirements
- expired permits
- concurrent updates
- duplicate commands
- SAP timeout/error
- retry and idempotency
- notification failures

## Quality
Tests must be deterministic. Avoid real SAP dependencies in unit tests. Use mocks/stubs for SAP and external services.
