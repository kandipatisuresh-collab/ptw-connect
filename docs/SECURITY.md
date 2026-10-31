# Security

Authentication is designed for OAuth 2.0/OIDC with configurable role and plant/area scope.
State-changing commands enforce authorization in the domain layer, use correlation IDs, apply
optimistic concurrency, and return safe errors. Secrets and tokens are excluded from logs. File
uploads require type/size validation and a malware-scanning integration before download.
