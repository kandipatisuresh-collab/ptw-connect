# PTW Connect Phase 2 Platform Scaffold

**Date**: 2026-09-11
**Status**: Local development scaffold; not operationally approved

## Scope Delivered

Phase 2 currently provides:

- Spring Boot 3 backend targeting Java 21 in `backend/`.
- Public `/api/v1/health` and Actuator health/readiness endpoints.
- Development-only mock identity under the explicit `mock` Spring profile.
- Opt-in `X-Mock-User` request identity with a `DEVELOPMENT_ONLY` role marker.
- Non-mock security configuration reserved for Microsoft Entra ID JWT validation.
- MySQL 8.4 Compose service and Flyway platform baseline migration.
- React, TypeScript, Vite, and Material UI frontend shell in `frontend/`.
- Safety limitation displayed in the frontend and returned by the backend health response.
- Dockerfiles, health checks, environment placeholders, and local Compose wiring.

No permit entity, permit transition, approval, activation, SAP call, notification
 delivery, or autonomous safety decision is implemented in this increment.

## Local Runtime

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8080
MySQL:    localhost:3307 -> container port 3306
```

The host MySQL port is `3307` because another local process already occupied
`127.0.0.1:3306`. The backend connects to the Compose service name `mysql:3306` and
is independent of the host port mapping.

## Validation Evidence

- Backend container build: PASS with Maven and Eclipse Temurin Java 21.
- Backend tests: PASS, 2 tests and 0 failures.
- Frontend production build: PASS with TypeScript and Vite.
- Compose configuration: PASS.
- MySQL health: PASS.
- Flyway baseline: PASS, `platform baseline` installed at version `1`.
- Backend health: PASS, `/api/v1/health` returned `UP`.
- Backend readiness: PASS, `/actuator/health/readiness` returned `UP`.
- Mock session: PASS, response explicitly identifies `DEVELOPMENT_ONLY`.
- Frontend HTTP smoke test: PASS, `http://localhost:5173/` returned `200` and served
  the PTW Connect shell.

## Assumptions and Risks

- The mock identity provider is local-development-only and must never be enabled in a
  production environment.
- Entra issuer, claims, role mapping, and token policy remain unconfigured placeholders.
- The Flyway baseline is intentionally minimal; domain migrations require the approved
  data model and later implementation tasks.
- MySQL 8.4 produced a Flyway compatibility warning because the bundled Flyway version
  lists MySQL 8.1 as its latest tested version. Customer/database-owner validation is
  required before production use.
- The Phase 1 review record contains accepted product/architecture evidence but still
  requires the remaining HSE, operations, security, legal/privacy, and SAP reviewer
  records. This scaffold was started by explicit user direction and is not a release
  approval.

## Next Increment

The next implementation slice is server-side users, roles, plant/location authorization,
and configurable master-data foundations. It must add denied-path tests and preserve the
human-review safety boundary before any permit workflow is enabled.
