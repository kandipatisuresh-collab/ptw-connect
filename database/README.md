# PTW Connect Database

Phase 2 owns MySQL 8 and Flyway schema delivery. The current baseline migration lives
inside the backend classpath so the Spring service can validate the Compose wiring. Domain
migrations remain deferred until the Phase 1 review evidence and database design are
accepted for implementation.

Local development uses synthetic data and non-production credentials from
`.env.example`. Never place production secrets in this repository.
