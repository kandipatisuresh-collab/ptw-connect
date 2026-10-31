---
name: postgresql-enterprise-data-modeling
description: PostgreSQL schema and data engineering guidance for PTW.
---

# PostgreSQL Skill

## Core entities
Design normalized schemas for:
users, roles, permissions, permits, permit_types, permit_status_history,
permit_approvals, checklists, checklist_items, risk_assessments, hazards,
risk_controls, gas_tests, isolations, attachments, notifications, audit_logs,
workflow_definitions, workflow_instances, workflow_tasks, SAP reference data,
integration_logs and integration_errors.

## Rules
- Use primary keys and foreign keys.
- Index common search/filter fields.
- Use transactions for lifecycle changes.
- Preserve immutable audit history.
- Separate internal UUIDs from SAP business identifiers.
- Add created_at, created_by, updated_at and updated_by where appropriate.
- Use database constraints for important invariants.
- Avoid storing derived data unless justified.

## Migration
Use versioned migrations and repeatable seed/configuration data where appropriate.
