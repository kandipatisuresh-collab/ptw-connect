---
name: enterprise-fullstack-typescript
description: Full-stack TypeScript engineering standards for the PTW application.
---

# Full-Stack TypeScript Skill

## Preferred stack
Frontend: React + TypeScript + enterprise component library.
Backend: Node.js + TypeScript + REST.
Database: PostgreSQL.

## Architecture
Separate:
- presentation
- application/use cases
- domain
- infrastructure
- integrations

Do not place business rules in React components.

## Frontend
Use typed API clients, reusable forms, validation, accessible components, responsive layouts and clear loading/error states.

## Backend
Use DTO validation, service boundaries, dependency injection, structured logging, consistent error responses and transaction boundaries.

## Code quality
Use strict TypeScript. Prefer small cohesive modules. Avoid `any` unless justified. Keep domain models independent from database and SAP payload models.

## Configuration
Use environment variables/secrets management. Never commit secrets.

## UX
PTW forms should clearly show permit status, validity, safety prerequisites, approvals and outstanding actions.
