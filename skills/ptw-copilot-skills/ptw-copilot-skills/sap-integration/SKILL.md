---
name: sap-integration-odata
description: Enterprise SAP integration guidance using APIs, OData and SAP Integration Suite.
---

# SAP Integration / OData Skill

## Architecture
Use:
PTW -> API Gateway/Application -> Integration Layer -> SAP S/4HANA

For asynchronous flows:
SAP -> Integration/Event Layer -> PTW.

## Responsibilities
Support:
- API authentication
- request/response mapping
- OData pagination and filtering where applicable
- retries with backoff
- idempotency
- correlation IDs
- timeout handling
- dead-letter/error queue
- monitoring

## Integration contract
Define canonical PTW models independently from SAP payloads. Use mapping classes/services between them.

## Security
Use enterprise secret storage. Never commit credentials. Never place access tokens in logs, database records or error messages.

## Reliability
Use idempotency keys for commands that may be retried. Do not blindly retry non-idempotent operations.

## Testing
Create mock SAP adapters and contract tests. Real SAP connectivity must be isolated behind interfaces.

## Deliverables
Generate:
- integration interfaces
- mapping models
- configuration
- error taxonomy
- retry strategy
- monitoring hooks
- contract-test fixtures
- SAP API mapping document
