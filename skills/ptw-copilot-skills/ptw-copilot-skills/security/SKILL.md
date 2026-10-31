---
name: enterprise-security-rbac-owasp
description: Security, identity and authorization standards for the PTW application.
---

# Security Skill

## Identity
Support OAuth 2.0 / OpenID Connect and enterprise identity providers such as Microsoft Entra ID.

## Authorization
Implement RBAC and resource-level authorization. Roles may include Requester, Issuer, Area Authority, Safety Officer, Isolation Authority, Supervisor, Administrator and Auditor.

## Security requirements
Apply OWASP-aligned controls:
- input validation
- output encoding
- SQL injection prevention
- XSS protection
- secure headers
- CSRF protection where applicable
- rate limiting
- secure session/token handling
- least privilege
- secrets management
- encryption in transit and at rest

## Critical rule
A user interface check is never sufficient authorization. Every protected command must be authorized on the server.

## Audit
Record security-sensitive and business-critical actions without storing credentials or access tokens.
