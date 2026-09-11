# PTW Connect Phase 3 Platform Status

Phase 3 identity and master-data foundations are implemented locally on top of the
Phase 2 Compose stack. The current increment is development-only and contains no permit
creation or safety-critical transition behavior.

Server-enforced controls include authenticated subject lookup, role membership, active
plant/location scope, administrator-only management endpoints, delegation date checks,
and denied-path responses for unknown identities, unauthenticated requests, non-admin
users, and unauthorized plants.
