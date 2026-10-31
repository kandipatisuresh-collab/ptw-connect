# SAP PM Adapter Contract

The PTW domain depends on capabilities, not a fixed SAP release or fabricated endpoint. An adapter
must provide the following operations through the configured integration layer:

- Search and retrieve maintenance notifications.
- Search and retrieve maintenance orders and their operations.
- Retrieve equipment, functional locations, and work centers.
- Synchronize configured master data and maintenance objects.
- Optionally publish permit status or safety updates only when explicitly enabled by a supported
  SAP business process.

Each operation accepts a correlation ID, caller scope, search or object criteria, and timeout or
retry policy. Each result identifies the SAP object type, business identifier, source timestamp,
source status, and sanitized attributes. Failures identify a safe error code and whether retry or
manual reprocessing is appropriate.

The adapter must:

- Keep SAP credentials in enterprise secret configuration, never in source or logs.
- Preserve SAP business identifiers and source snapshots in PTW records.
- Expose capability metadata so unsupported outbound actions are unavailable.
- Support controlled retry, error queue, and reprocessing for asynchronous work.
- Avoid making permit safety decisions depend on an unavailable external response.

The SAP team must provide the actual services, fields, authentication model, landscape mappings,
rate limits, and outbound business-process approvals before production integration testing.
