# Quickstart Validation Guide

This guide validates the planned PTW vertical slice. It is intentionally a run guide, not an
implementation recipe.

## Prerequisites

- A development identity provider or test identity fixture with requester, reviewer, issuer,
  isolation authority, safety officer, administrator, and auditor roles.
- A PostgreSQL test database configured through environment-specific secrets.
- A stub or sandbox SAP adapter that can return one maintenance order, notification, equipment,
  functional location, work center, and operation, plus a controlled failure response.
- Test notification, file scanning, and QR/device capabilities or approved test doubles.
- Dependencies installed according to the repository setup documentation once implementation begins.

## Validation Scenarios

1. **Create and submit**
   - Sign in as a Permit Requester.
   - Create a standard permit, enter work location, planned dates, crew, and description.
   - Save, reload, complete required fields, and submit.
   - Confirm the permit is SUBMITTED, visible to its reviewers, and present in audit history.

2. **Risk and checklist gate**
   - Add a hazard with likelihood and severity.
   - Confirm the score and category are calculated from the active matrix.
   - Leave a mandatory checklist item incomplete and attempt submission or approval.
   - Confirm the action is blocked; complete the item and continue.

3. **Gas testing and isolation gate**
   - Record an over-threshold gas result and confirm the warning and blocked approval.
   - Add an isolation and move it through valid states to VERIFIED.
   - Attempt issue before verification and confirm rejection; verify it can proceed afterward.

4. **Approval and lifecycle control**
   - Complete the configured approval chain and issue the permit.
   - Activate it, suspend it, confirm notification and visible stopped-work state, then resume it.
   - Close it only after work completion and isolation release.
   - Attempt an invalid transition with an unauthorized role and confirm rejection plus audit record.

5. **SAP context and failure recovery**
   - Search the test SAP adapter and associate a maintenance order with the permit.
   - Confirm source fields are read-only and source identifiers are preserved.
   - Simulate an unavailable source and confirm safe recovery messaging, integration logging, and
     reprocessing without losing the permit relationship.

6. **Field and access controls**
   - Use a phone-sized viewport to complete an assigned checklist and attach a photograph.
   - Scan the active permit identifier and verify the authenticated view is appropriately limited.
   - Attempt access from an out-of-scope user and confirm denial without confidential data leakage.

7. **Audit and reporting**
   - Sign in as an auditor and retrieve the permit history and active/high-risk report.
   - Confirm decisions, safety controls, isolations, attachments, notifications, integrations, and
     actors are present while the auditor cannot mutate records.

## Expected Outcomes

- Invalid, unsafe, or unauthorized actions are rejected with a safe message and correlation ID.
- Accepted actions update the permitted state and create complete audit evidence.
- External failures remain visible and recoverable without bypassing safety controls.
- Search, responsive field workflows, QR verification, and authorized reports meet the measurable
  outcomes in [spec.md](spec.md).

## Related Design Artifacts

- Domain entities and invariants: [data-model.md](data-model.md)
- External contracts: [contracts/](contracts/)
- Requirements and acceptance scenarios: [spec.md](spec.md)
