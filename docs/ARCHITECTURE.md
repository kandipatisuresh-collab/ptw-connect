# Architecture

The PTW platform separates responsive field and operations experiences from the domain workflow,
REST API, PostgreSQL persistence, notifications, secure file storage, and SAP capability adapters.
Permit safety decisions do not depend on SAP availability.

```mermaid
flowchart LR
  User --> Web[Responsive PTW Web]
  Web --> API[REST API]
  API --> Domain[Permit and Safety Domain]
  Domain --> DB[(PostgreSQL)]
  API --> Integration[SAP Adapter]
  Integration --> SAP[SAP S/4HANA PM]
  Domain --> Audit[Append-only Audit]
```
