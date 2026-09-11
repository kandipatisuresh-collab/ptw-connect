# PTW Connect Phase 1 Artifact Index

| Artifact | Purpose | Requirements | Required reviewers | Evidence |
|---|---|---|---|---|
| `architecture.md` | System boundaries, actors, safety boundary, Mermaid architecture | FR-001, FR-003, FR-007, FR-014 | Product, architecture, HSE, security | Rendered diagram and review-record entry |
| `repository-structure.md` | Monorepo ownership and Phase boundary | FR-002, FR-008 | Architecture, delivery, security | Structure review |
| `data-model.md` | Entities, relationships, Mermaid ERD, history/concurrency rules | FR-004, FR-005 | Database, HSE, operations, security | Rendered ERD and review-record entry |
| `workflow.md` | 17 states, transition guards, safety evidence | FR-006, FR-007, FR-014 | HSE, operations, workflow, security | Workflow review and negative cases |
| `hse-validation-checklist.md` | Site safety and operational validation | FR-012, FR-014, SC-007 | Competent HSE and operations | Signed checklist |
| `contracts/api-outline.md` | API resources and common outcomes | FR-009, FR-010 | API, security, frontend/backend | Contract review |
| `contracts/operation-contract-matrix.md` | Per-command DTO, actor, scope, evidence, SOD, replay, concurrency, audit | FR-009, FR-010, FR-014, SC-005 | API, security, workflow, HSE | Matrix completeness review |
| `contracts/authorization-contract.md` | Server authorization and SOD | FR-006, FR-014 | Security, identity, HSE | Authorization review |
| `contracts/integration-contract.md` | SAP and notification boundaries | FR-011, FR-014 | SAP, security, operations | Mapping/connectivity open questions |
| `contracts/audit-contract.md` | Immutable history, redaction, retention, legal hold | FR-004, FR-005, FR-006, FR-014 | Security, legal, audit | Audit review |
| `backlog.md` | Phase 1-9 dependency-ordered work and evidence | FR-008, SC-004, SC-006 | Product, architecture, delivery | Backlog review |
| `assumptions-and-open-questions.md` | Feature-local open-question register | FR-012, FR-013, SC-006 | HSE, operations, security, legal, SAP | Link to root canonical record |
| `docs/assumptions-and-open-questions.md` | Repository-level canonical assumptions record | Constitution governance | Project owner and domain owners | Root governance review |
| `traceability.md` | Requirement/story/artifact/validation mapping | FR-015, SC-001 to SC-006 | QA, architecture, product | Traceability review |
| `quickstart.md` | Runnable artifact validation and review procedure | FR-015, SC-003 | QA and reviewers | Command output and review record |
| `checklists/phase-1-review.md` | Phase gate checklist | FR-014, FR-015, SC-007 | All required gate owners | Completed checklist |
| `review-record.md` | Automated checks, diagram reviews, human decisions | FR-015, SC-001 to SC-007 | All required gate owners | Signed review record |
