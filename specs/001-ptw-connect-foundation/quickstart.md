# Phase 1 Artifact Validation Guide

This guide validates the PTW Connect Phase 1 design artifacts. It does not start a
runtime service, connect to SAP, create a database, or execute business behavior.

## Prerequisites

- A POSIX-compatible shell
- Python 3 for JSON validation
- The repository root as the current directory
- A Markdown viewer capable of Mermaid diagrams for visual review

## Expected Artifact Set

The feature directory must contain:

- `plan.md`
- `research.md`
- `architecture.md`
- `repository-structure.md`
- `data-model.md`
- `workflow.md`
- `hse-validation-checklist.md`
- `backlog.md`
- `assumptions-and-open-questions.md`
- `artifact-index.md`
- `traceability.md`
- `quickstart.md`
- `review-record.md`
- `checklists/phase-1-review.md`
- `contracts/api-outline.md`
- `contracts/operation-contract-matrix.md`
- `contracts/authorization-contract.md`
- `contracts/integration-contract.md`
- `contracts/audit-contract.md`
- `checklists/requirements.md`

The repository must also contain the source specification, constitution, and feature
locator:

- `specs/001-ptw-connect-foundation/spec.md`
- `.specify/memory/constitution.md`
- `.specify/feature.json`

## Structural Validation

Run from the repository root:

```sh
set -eu
feature_dir="specs/001-ptw-connect-foundation"
for file in \
  "$feature_dir/plan.md" \
  "$feature_dir/research.md" \
  "$feature_dir/architecture.md" \
  "$feature_dir/repository-structure.md" \
  "$feature_dir/data-model.md" \
  "$feature_dir/workflow.md" \
  "$feature_dir/hse-validation-checklist.md" \
  "$feature_dir/backlog.md" \
  "$feature_dir/assumptions-and-open-questions.md" \
  "$feature_dir/artifact-index.md" \
  "$feature_dir/traceability.md" \
  "$feature_dir/quickstart.md" \
  "$feature_dir/review-record.md" \
  "$feature_dir/checklists/phase-1-review.md" \
  "$feature_dir/contracts/api-outline.md" \
  "$feature_dir/contracts/operation-contract-matrix.md" \
  "$feature_dir/contracts/authorization-contract.md" \
  "$feature_dir/contracts/integration-contract.md" \
  "$feature_dir/contracts/audit-contract.md" \
  "$feature_dir/checklists/requirements.md" \
  "specs/001-ptw-connect-foundation/spec.md" \
  ".specify/memory/constitution.md" \
  ".specify/feature.json"; do
  test -s "$file"
done
test -s "docs/assumptions-and-open-questions.md"
python -m json.tool .specify/feature.json >/dev/null
printf '%s\n' "Phase 1 artifact structure is present."
```

Expected result: every file exists and the feature locator is valid JSON.

## Placeholder and Boundary Validation

```sh
set -eu
feature_dir="specs/001-ptw-connect-foundation"
! grep -R -nE --exclude='quickstart.md' --exclude='requirements.md' \
  '\[NEEDS CLARIFICATION|\[FEATURE\]|\[DATE\]|\[###' "$feature_dir"
if grep -nE 'Phase 2 (behavior|scaffolding|implementation).*implemented|business code.*complete' \
  "$feature_dir/plan.md"; then
  exit 1
fi
printf '%s\n' "No unresolved planning placeholders found."
```

Expected result: no unresolved template markers and no claim that Phase 2 behavior is
implemented. Mentions of Phase 2 in a prohibition or future-state description are
expected.

## Contract Coverage Review

Confirm that `contracts/api-outline.md` contains all of these groups:

- Identity and authorization
- Permit and risk assessment
- Isolation, gas testing, toolbox talk, and lifecycle commands
- Workflow history and audit
- Attachments
- SAP maintenance-order and synchronization operations
- Notification/outbox monitoring
- Dashboard/reporting and health
- RFC 7807-compatible errors, pagination, scope, correlation, and idempotency

Confirm that every state-changing operation has a row in
`contracts/operation-contract-matrix.md` identifying an authenticated actor,
plant/location scope, current-state check, mandatory evidence, SOD rule, idempotency
key, optimistic-concurrency behavior, server-owned timestamp, response/status, and
audit outcome.

Confirm that every row in `backlog.md` contains owner, dependencies, requirements,
assumptions, acceptance criteria, evidence, validation command, and gate.

## Domain and Safety Review

Open `architecture.md` and `data-model.md` in a Mermaid-capable Markdown viewer and
record reviewer, date, rendering result, issues, and disposition in `review-record.md`.
Verify:

1. The architecture diagram shows the secured backend and no browser-to-SAP route.
2. The 17 PRD states are present.
3. `APPROVED`, `ISSUED`, and `ACTIVE` are distinct.
4. Isolation, gas-test, toolbox-talk, validity, and risk evidence precede activation.
5. Workflow and audit history are append-only.
6. Plant/location authorization and user roles are represented.
7. SAP data is linked through a configurable reference and synchronization event.
8. Closed permits require controlled, auditable amendment rather than direct mutation.

A competent HSE representative and an operations representative must review and sign
off site-specific permit types, hazards, risk matrix, gas limits, isolation rules,
approval levels, handover, extension, suspension/resumption, validity, retention,
legal requirements, and emergency procedures before Phase 2 is approved.

## Completion Evidence

Record the date, reviewers, commands run, outcomes, diagram rendering results,
unresolved risks, and required follow-up in the Phase 1 review record. Do not begin
PRD Phase 2 until the artifact set,
constitution gates, HSE/operations review, security review, and SAP open questions are
accepted by the responsible human owners.
