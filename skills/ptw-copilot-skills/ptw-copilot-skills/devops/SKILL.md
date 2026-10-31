---
name: github-actions-devsecops
description: CI/CD, container and DevSecOps guidance for the PTW application.
---

# GitHub Actions / DevSecOps Skill

## Pipeline
Recommended stages:
lint -> typecheck -> unit tests -> integration tests -> security scan -> build -> container scan -> package -> deploy.

## Practices
- Protect main branch.
- Require pull requests and reviews.
- Store secrets in GitHub/environment secret stores.
- Never print secrets.
- Pin or control action versions according to enterprise policy.
- Generate SBOM where required.
- Scan dependencies and containers.
- Use separate development, test and production environments.
- Add deployment approvals for production.

## Containers
Use minimal non-root images and multi-stage builds where appropriate.

## Observability
Provide structured logs, metrics, health checks and correlation IDs. Do not log sensitive information.
