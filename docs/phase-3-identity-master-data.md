# PTW Connect Phase 3: Identity and Master Data

**Status**: Initial implementation slice
**Date**: 2026-09-11

## Delivered

- Synthetic users and roles stored through Flyway migration `V2__identity_and_master_data.sql`.
- Configurable work centers, equipment, PPE, gas limits, isolation types, workflow
  definitions, approval matrix, calendars, and delegations stored through
  `V3__phase3_master_data_and_delegation.sql`.
- Risk matrix configuration stored through `V4__phase3_risk_matrix_and_authorization_admin.sql`.
- Server-side user lookup from the authenticated subject.
- Role lookup and effective plant/location authorizations.
- Scoped read endpoints for plants, permit types, hazards, controls, and configurable
  master-data catalogs.
- Administrator-only user listing, role assignment, status update, and delegation
  foundations, scoped to an administrator's authorized plant.
- RFC 7807-style authorization problem responses for unknown/inactive identities.
- Negative web-slice tests for unauthenticated access, unknown mock identities, and
  non-administrator access.
- Frontend access-context panel showing the server-resolved profile, roles, and
  authorized plants in local mock mode.

## Endpoints

- `GET /api/v1/users/me`
- `GET /api/v1/users/me/authorizations`
- `GET /api/v1/master-data/plants`
- `GET /api/v1/master-data/permit-types`
- `GET /api/v1/master-data/hazards`
- `GET /api/v1/master-data/controls`
- `GET /api/v1/master-data/companies`
- `GET /api/v1/master-data/business-units`
- `GET /api/v1/master-data/functional-locations`
- `GET /api/v1/master-data/work-centers`
- `GET /api/v1/master-data/equipment`
- `GET /api/v1/master-data/ppe-requirements`
- `GET /api/v1/master-data/gas-test-limits`
- `GET /api/v1/master-data/isolation-types`
- `GET /api/v1/master-data/workflow-definitions`
- `GET /api/v1/master-data/approval-matrix`
- `GET /api/v1/master-data/risk-matrices`
- `GET /api/v1/master-data/holiday-calendars`
- `GET /api/v1/master-data/shift-calendars`
- `GET /api/v1/admin/users`
- `PUT /api/v1/admin/users/{subject}/status`
- `PUT /api/v1/admin/users/{subject}/roles`
- `GET /api/v1/admin/delegations`
- `POST /api/v1/admin/delegations`
- `GET /api/v1/admin/authorizations`
- `POST /api/v1/admin/authorizations`

The local Compose frontend build sets `VITE_USE_MOCK_IDENTITY=true` and uses the
synthetic `synthetic.user` subject. Production builds must leave this flag disabled
and use the approved Entra/OIDC integration.

All results are constrained by active server-side user authorization. A caller cannot
select an unauthorized plant and receive data for it. The seeded records are synthetic
and are not production authorization data.

## Safety and Security Boundary

This increment does not create permits or perform safety-critical transitions. It does
not grant operational authority based on the frontend. Mock identity remains local
-development-only; production must use the approved Entra/OIDC identity configuration.

## Validation

- Maven/Java 21 backend tests run in the builder container.
- Flyway migrations V2, V3, and V4 are applied by the running Compose backend.
- Authorized synthetic subject returns profile and scoped master data.
- Unknown subject returns authorization denied.
- Unauthenticated requests are rejected.
- Non-administrator users receive `403` on administrator routes.
- Administrator delegation create/list smoke test passes with synthetic data.
