# PTW Application Copilot Instructions

This repository implements an enterprise Permit to Work application integrated with SAP S/4HANA Plant Maintenance.

## Non-negotiable principles
- Treat PTW as a safety-critical domain.
- Keep HSE rules configurable; never invent company-specific requirements.
- Keep SAP integration behind adapters/interfaces.
- Never fabricate SAP API endpoints.
- Enforce workflow and authorization rules server-side.
- Maintain immutable audit history for material business actions.
- Never commit secrets or expose credentials in logs.
- Prefer small, testable, typed modules.
- Every critical workflow transition requires automated tests.
- Document assumptions and unresolved SAP/API dependencies.

## Skills
See `.github/skills/*/SKILL.md` for domain-specific instructions. Apply the relevant skill whenever working in that area.
