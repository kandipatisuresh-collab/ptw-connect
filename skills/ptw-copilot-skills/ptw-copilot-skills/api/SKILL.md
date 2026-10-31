---
name: enterprise-rest-api-design
description: REST and OpenAPI standards for the PTW application.
---

# REST API Skill

## Design
Use resource-oriented, predictable endpoints and OpenAPI documentation.

Examples:
POST /api/permits
GET /api/permits/{permitId}
POST /api/permits/{permitId}/submit
POST /api/permits/{permitId}/approve
POST /api/permits/{permitId}/issue
POST /api/permits/{permitId}/suspend
POST /api/permits/{permitId}/resume
POST /api/permits/{permitId}/close

## Standards
Support:
- authentication/authorization
- request validation
- pagination
- filtering
- sorting
- idempotency for commands where appropriate
- correlation IDs
- consistent error envelopes
- API versioning strategy

Never expose stack traces or secrets.
