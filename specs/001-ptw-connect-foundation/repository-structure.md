# PTW Connect Repository Structure

**Status**: Phase 1 design boundary; directories are not runtime implementation

```text
ptw-connect/
├── frontend/                    # React, TypeScript, Vite, Material UI application
├── backend/                     # Java 21, Spring Boot 3 Maven service
├── database/                    # MySQL 8 schema and Flyway migrations
├── integration/                 # SAP and notification ports/adapters and mappings
├── deployment/                  # Docker, Kubernetes/Helm, and environment assets
├── docs/                        # Governance, architecture, security, operations, HSE
│   └── assumptions-and-open-questions.md
├── specs/                       # Spec Kit feature specifications and design artifacts
├── .github/
│   ├── copilot-instructions.md  # Repository engineering and safety instructions
│   └── workflows/               # CI checks; production gate remains mandatory
├── docker-compose.yml           # Phase 2 local development asset
├── README.md                    # Project setup and operating boundary
└── .env.example                 # Placeholder configuration only; no secrets
```

## Ownership Rules

- Frontend code may call only the secured PTW backend APIs. It must not call SAP,
  object storage, or notification providers directly.
- Backend code owns all authorization, workflow transition guards, server timestamps,
  idempotency, optimistic concurrency, audit creation, and DTO mapping.
- Database changes are versioned and reviewed with backend behavior. Audit and workflow
  history cannot be hard-deleted or updated through ordinary application paths.
- Integration adapters use ports and configuration. No SAP endpoint, field, status, or
  authentication detail is considered valid until customer metadata is reviewed.
- Documentation records assumptions and validation decisions. Root-level material
  assumptions are maintained in `docs/assumptions-and-open-questions.md`.
- Deployment assets contain placeholders only. Production secrets come from an approved
  secrets manager and production deployment requires an approved environment gate.

## Phase Boundary

Phase 1 creates documentation and contract artifacts under
`specs/001-ptw-connect-foundation/` plus the constitution-required root assumptions
record. Phase 2 creates runtime scaffolding only after the Phase 1 review record is
accepted. Later phases add business capabilities in PRD order.
