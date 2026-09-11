# PTW Connect

PTW Connect is an enterprise Permit-to-Work platform for safety-critical work control.
It supports competent human decision-making and never autonomously decides that work is
safe, approves a permit, or activates work.

## Current Status

Phase 1 architecture and design artifacts are complete. Phase 2 platform scaffolding and
the initial Phase 3 identity/master-data slice are implemented: Java 21/Spring Boot
backend, React/TypeScript frontend, MySQL 8, Flyway migrations, Docker Compose, health
checks, development-only mock identity, server-resolved roles, plant/location scope,
delegation foundations, and scoped master-data catalogs.

The Phase 2 mock identity profile is for local development only. Production identity must
use the approved Microsoft Entra ID/OIDC configuration. Permit workflows and safety-
critical actions are not implemented in this scaffold.

## Run Locally

1. Copy `.env.example` to `.env` and keep the values local-only.
2. Start the platform:

   ```sh
   docker compose up --build
   ```

3. Open the frontend at `http://localhost:5173`.
4. Check backend health at `http://localhost:8080/api/v1/health` and
   `http://localhost:8080/actuator/health`.
5. The Compose MySQL port is exposed on `localhost:3307` by default so it does not
   conflict with an existing local MySQL server. The backend uses the internal
   Compose address `mysql:3306`.

To stop the stack:

```sh
docker compose down
```

Add `-v` only when you intentionally want to remove the local MySQL volume.

## Repository Areas

- `frontend/`: React/MUI platform shell and access context
- `backend/`: Spring Boot health, security, Flyway, identity, authorization, and master data
- `database/`: database ownership notes and migration boundary
- `integration/`: external gateway boundary
- `deployment/`: local and future deployment assets
- `docs/` and `specs/`: architecture, safety, contracts, and review evidence

Do not treat this scaffold as operationally approved. HSE, operations, security, legal,
and customer SAP review remains required before safety-critical implementation or release.
