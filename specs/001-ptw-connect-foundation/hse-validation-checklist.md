# PTW Connect HSE and Operations Validation Checklist

**Status**: Human validation required; this checklist is not approval
**Evidence record**: [review-record.md](./review-record.md)
**Related artifacts**: [workflow.md](./workflow.md), [data-model.md](./data-model.md),
and [authorization-contract.md](./contracts/authorization-contract.md)

Competent HSE and operations representatives must validate the following before any
implementation is released for operational use or any PRD Phase 2 work is approved.

- [ ] Permit types and site applicability
- [ ] Hazard catalog and control measures
- [ ] PPE requirements and simultaneous-operations rules
- [ ] Risk matrix, scoring, residual-risk thresholds, and HSE-review triggers
- [ ] Oxygen, LEL, H2S, CO, other-gas limits, units, warning/blocking rules, and retest frequency
- [ ] Electrical, mechanical, process, and instrument isolation rules
- [ ] Isolation point, tag, lock, independent-verification, evidence, and de-isolation rules
- [ ] Approval levels, routing, sequential/parallel behavior, delegation, escalation, and SOD
- [ ] Role names and responsibilities for requester, issuer, receiver, tester, verifier, approver, and controller
- [ ] Shift calendar, handover acceptance, exceptions, and suspended/active permit treatment
- [ ] Extension, risk reassessment, reapproval, suspension, and resumption rules
- [ ] Permit validity, timezone, expiry, grace-period, and server-time requirements
- [ ] Handback, housekeeping, personnel/tools removal, de-isolation, closure, and amendment rules
- [ ] Legal and regulatory requirements
- [ ] Record-retention period, legal hold, privacy, and audit immutability
- [ ] Emergency procedures and escalation behavior

## Required Evidence

The reviewer must record the site, reviewer identity, date, approved configuration or
policy reference, unresolved issue, and decision in [review-record.md](./review-record.md)
and the canonical root record at `docs/assumptions-and-open-questions.md`.
