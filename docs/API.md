# API

The first vertical slice exposes `GET /api/permits`, `GET /api/permits/{id}`,
`POST /api/permits`, and `POST /api/permits/{id}/submit`. All requests require an authenticated
actor context and return `x-correlation-id`; errors use the contract in
`specs/001-enterprise-ptw-platform/contracts/permit-api.md`.
