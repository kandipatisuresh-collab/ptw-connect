# PTW Connect Phase 1 Traceability Matrix

**Status**: Phase 1 design traceability; validation evidence is pending human review

## Functional Requirements

| Requirement | Artifact and evidence | Tasks |
|---|---|---|
| FR-001 | `architecture.md`, `artifact-index.md` | T011, T015 |
| FR-002 | `repository-structure.md` | T012, T015 |
| FR-003 | Mermaid diagram in `architecture.md`, `review-record.md` | T013, T030 |
| FR-004 | `data-model.md`, `workflow.md`, contract files | T016-T021 |
| FR-005 | Mermaid ERD in `data-model.md`, `review-record.md` | T018, T030 |
| FR-006 | `workflow.md`, `authorization-contract.md`, operation matrix | T005, T016, T020, T021, T022 |
| FR-007 | `architecture.md`, `workflow.md`, operation matrix | T014, T016, T020, T022 |
| FR-008 | `backlog.md`, `repository-structure.md`, `review-record.md` | T023, T033 |
| FR-009 | `api-outline.md`, `operation-contract-matrix.md` | T006, T022 |
| FR-010 | API common rules and operation matrix | T006, T022, T027 |
| FR-011 | `integration-contract.md`, `assumptions-and-open-questions.md` | T008, T024, T025 |
| FR-012 | Feature and root assumptions records, HSE checklist | T024, T026 |
| FR-013 | Root/feature assumptions record and research | T026 |
| FR-014 | Authorization, workflow, audit, integration, HSE checklist | T005-T008, T016, T021, T031 |
| FR-015 | `quickstart.md`, `review-record.md`, phase review checklist | T029-T033 |

## Success Criteria

| Criterion | Evidence | Validation |
|---|---|---|
| SC-001 | `artifact-index.md`, all listed artifacts, `review-record.md` | Structural command and human gate |
| SC-002 | `workflow.md`, `data-model.md`, operation matrix | 17-state and transition review |
| SC-003 | `quickstart.md` command output | Reviewer completion-rate record |
| SC-004 | `backlog.md` per-row evidence columns | Backlog review |
| SC-005 | Operation contract matrix | Matrix completeness review |
| SC-006 | Root assumptions record with owners/status | Assumptions review |
| SC-007 | HSE checklist and review record | HSE/operations sign-off |

## User Stories

| Story | Independent evidence |
|---|---|
| US1 | `architecture.md`, `repository-structure.md`, rendered architecture diagram |
| US2 | `data-model.md`, `workflow.md`, HSE checklist, rendered ERD |
| US3 | `api-outline.md`, operation matrix, `backlog.md`, assumptions, this matrix |

All rows remain subject to the phase gate. A traceability link is not evidence that a
human reviewer has approved the underlying safety or legal decision.
