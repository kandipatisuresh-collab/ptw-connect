Act as a senior enterprise solution architect, SAP EAM integration architect,
HSE Permit-to-Work domain specialist, security architect, Java developer,
React developer, MySQL database designer, DevOps engineer, and test engineer.

Build an enterprise-grade Permit to Work application named "PTW Connect".

IMPORTANT SAFETY REQUIREMENT
This application supports a safety-critical business process. It must not make
autonomous safety decisions, automatically approve permits, or replace competent
human review. Every permit approval, authorization, suspension, extension,
handback, and closure must be explicitly performed by an authenticated and
authorized user. Clearly display this limitation in the application and
documentation.

Do not generate the entire application as one unstructured change.
First create the architecture, backlog, data model, API contracts, and repository
structure. Then implement the solution module by module. After every module,
run tests, fix failures, and update the documentation.

==================================================
1. TARGET ARCHITECTURE
==================================================

Create a monorepo with the following structure:

ptw-connect/
  frontend/
  backend/
  database/
  integration/
  deployment/
  docs/
  .github/
    copilot-instructions.md
    workflows/
  docker-compose.yml
  README.md
  .env.example

Use:

Frontend:
- React
- TypeScript
- Vite
- Material UI
- React Hook Form
- Zod validation
- TanStack Query
- Accessible responsive design
- WCAG 2.2 AA principles

Backend:
- Java 21
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Spring Security
- Spring Validation
- Spring Actuator
- Flyway
- MapStruct
- Lombok only where appropriate
- Maven

Database:
- MySQL 8
- Flyway version-controlled migrations
- UTC timestamps
- Optimistic locking
- Referential integrity
- Soft deletion only where legally and operationally appropriate
- Immutable audit records

Authentication and identity:
- Microsoft Entra ID
- OAuth 2.0 and OpenID Connect
- JWT bearer token validation
- Local mock identity provider for development only
- Never store user passwords in the PTW database

Workflow:
- Implement a configurable database-driven workflow and approval engine
- Do not hard-code approvers in application code
- Determine approvers using plant, location, permit type, risk level,
  business unit, role, and approval amount or level where relevant
- Support sequential and parallel approvals
- Configure escalation and delegation
- Record every workflow action in an immutable workflow history

SAP integration:
- Use a ports-and-adapters architecture
- Define a MaintenanceOrderGateway interface
- Implement:
  1. SapS4HanaODataAdapter
  2. SapEccODataAdapter
  3. SapIntegrationSuiteAdapter
  4. MockMaintenanceOrderAdapter
- Do not invent SAP API fields or endpoints
- Keep SAP service URLs, entity names, field mappings, authentication,
  and version details configurable
- Include a mapping document for SAP maintenance order fields
- Include retry, timeout, circuit breaker, correlation ID, and error handling
- Never expose SAP credentials to the frontend
- Do not log SAP credentials, access tokens, or confidential payload fields
- Use OAuth 2.0, mTLS, principal propagation, or an enterprise-approved
  authentication method
- Basic authentication may only be enabled for local development and must be
  disabled by default

Notifications:
- Create a NotificationGateway interface
- Implement:
  1. MicrosoftGraphNotificationAdapter
  2. EmailStubNotificationAdapter
  3. TeamsStubNotificationAdapter
- Send approval requests, reminders, escalations, rejection messages,
  suspension alerts, expiry alerts, and closure notifications
- Notification failure must not cause loss of a workflow transaction
- Use an outbox pattern and retry mechanism

Deployment:
- Dockerfiles for frontend and backend
- Docker Compose for local development
- MySQL container
- Health checks
- Kubernetes manifests or Helm starter chart
- Environment-specific configuration
- No secrets committed to Git
- Production secrets must be obtained from a secure secrets manager

==================================================
2. BUSINESS CAPABILITIES
==================================================

Implement the following modules:

A. User and role administration
- User profile
- Role assignment
- Plant and location authorization
- Delegation with valid-from and valid-to dates
- Substitute approver
- Active/inactive status
- Segregation-of-duties validation

Use these initial roles:
- Permit Requester
- Performing Authority
- Area Authority
- Site Controller
- HSE Reviewer
- Gas Tester
- Electrical Isolation Authority
- Mechanical Isolation Authority
- Operations Representative
- Approver
- Permit Issuer
- Permit Receiver
- Auditor
- System Administrator
- Read-Only User

B. Master data
- Company
- Business unit
- Plant
- Functional location
- Equipment
- Work center
- Permit type
- Hazard category
- Control measure
- PPE requirement
- Gas-test limits
- Isolation type
- Approval matrix
- Workflow definition
- Holiday calendar
- Shift calendar

C. Permit types
Support configurable permit types including:
- General work permit
- Hot work
- Cold work
- Confined space entry
- Electrical work
- Excavation
- Working at height
- Lifting operation
- Radiography
- Line breaking
- Pressure testing
- Vehicle entry
- Energized work

Do not assume that this list is universally valid.
Make permit types configurable by organization and site.

D. Permit creation
A requester must be able to:
- Create a permit manually
- Create a permit from an SAP EAM maintenance order
- Search SAP work orders using plant, order number, equipment,
  functional location, date, status, and work center
- Select an SAP work order
- Copy configured fields from SAP into the permit
- Save as draft
- Attach documents, photographs, drawings, procedures, and certificates
- Add multiple work activities
- Add contractors and workers
- Add planned start and end times
- Select equipment and functional location
- Record job method statement and work description
- Add tools and materials
- Add simultaneous operations information

E. Risk assessment
- Hazard identification
- Initial likelihood
- Initial severity
- Initial risk score
- Control measures
- Residual likelihood
- Residual severity
- Residual risk score
- Risk matrix configuration
- Mandatory HSE review above a configurable threshold
- Prevent submission when mandatory fields or controls are missing
- Require human confirmation of the risk assessment
- Do not automatically decide that work is safe

F. Isolation and LOTO
- Electrical isolation
- Mechanical isolation
- Process isolation
- Instrument isolation
- Isolation point register
- Tag number
- Lock number
- Isolation status
- Isolation performed by
- Isolation verification by an independent authorized person
- Date and time
- Evidence attachment
- De-isolation workflow
- Prevent permit activation until mandatory isolation verification is complete

G. Gas testing
- Oxygen
- Lower explosive limit
- Hydrogen sulfide
- Carbon monoxide
- Other configurable gases
- Unit of measure
- Safe range
- Test location
- Tester
- Instrument ID
- Instrument calibration date
- Test date and time
- Initial and periodic tests
- Mandatory retesting frequency
- Warning and blocking rules based on site-configured limits
- Manual acknowledgment by an authorized gas tester

H. Approval workflow
Create a configurable workflow state machine.

Initial states:
- DRAFT
- SUBMITTED
- RISK_REVIEW
- ISOLATION_PENDING
- GAS_TEST_PENDING
- APPROVAL_PENDING
- APPROVED
- ISSUED
- ACTIVE
- SUSPENDED
- EXTENSION_PENDING
- HANDBACK_PENDING
- CLOSURE_PENDING
- CLOSED
- REJECTED
- CANCELLED
- EXPIRED

Required workflow behavior:
- Each transition must validate user role, authorization, current state,
  mandatory data, and segregation-of-duties rules
- Support sequential and parallel approval steps
- Approval routes depend on permit type, plant, location, residual risk,
  isolation requirement, and work category
- Approvers can approve, reject, return for correction, delegate, or request
  additional information
- Rejection and return require comments
- Record actor, timestamp, old state, new state, comments, IP address,
  correlation ID, and authentication identity
- Prevent users from approving their own permits when configured
- Prevent duplicate action caused by repeated requests
- Use idempotency keys
- Apply optimistic locking
- Display the complete workflow history

I. Permit issue and activation
- An approved permit is not automatically active
- Permit Issuer and Permit Receiver must complete a toolbox talk and
  acknowledgment
- Record workers attending the toolbox talk
- Display critical hazards and controls
- Capture issuer acknowledgment
- Capture receiver acknowledgment
- Activate only after all mandatory checks are completed
- Use server-side date and time
- Include a printable permit version with a QR code
- QR code must contain only a non-sensitive permit reference or secure URL

J. Suspension, extension, handback, and closure
- Suspend active permits
- Record suspension reason
- Resume using an approval or validation process
- Request extension before expiry
- Reassess risks when dates, scope, conditions, or personnel change
- Require configurable reapproval for extensions
- Record handback from Permit Receiver
- Verify work completion
- Confirm housekeeping
- Confirm removal of personnel and tools
- Complete de-isolation only through authorized workflow
- Close permit after required confirmations
- Prevent modification of closed permits
- Allow controlled correction through an auditable amendment process

K. Shift handover
- List active and suspended permits
- Record outgoing and incoming shift controllers
- Acknowledge each transferred permit
- Identify permits not accepted during handover
- Maintain immutable handover history

L. Dashboard and reporting
Create dashboards for:
- My draft permits
- Permits awaiting my approval
- Active permits
- Suspended permits
- Expiring permits
- Overdue permits
- Permits by plant
- Permits by type
- Permits by risk category
- Average approval time
- Rejection and return rate
- Isolation pending
- Gas test due
- SAP synchronization failures
- Notification failures

Provide CSV and PDF export, subject to user authorization.
Do not expose information outside the user’s permitted plant or location.

M. Audit and compliance
- Immutable audit trail
- Workflow history
- Login and access events
- Before-and-after values for controlled changes
- Attachment access history
- SAP synchronization history
- Notification history
- Administrative configuration changes
- Searchable audit reports
- Configurable data-retention settings
- Legal hold indicator
- Tamper-evident audit design recommendation

==================================================
3. SAP EAM INTEGRATION
==================================================

Define a canonical MaintenanceOrder model with fields such as:
- sapSystemId
- orderNumber
- orderType
- shortText
- longText
- plant
- planningPlant
- maintenancePlant
- mainWorkCenter
- functionalLocation
- equipmentNumber
- priority
- systemStatus
- userStatus
- basicStartDate
- basicFinishDate
- scheduledStartDate
- scheduledFinishDate
- plannerGroup
- responsiblePerson
- operationNumber
- operationDescription

Treat these fields as a proposed canonical model.
Do not claim they match a specific SAP API until validated against its metadata.

Create the following backend endpoints:
- GET /api/v1/sap/maintenance-orders
- GET /api/v1/sap/maintenance-orders/{orderNumber}
- POST /api/v1/permits/from-maintenance-order/{orderNumber}
- POST /api/v1/permits/{permitId}/sync-sap
- GET /api/v1/sap/sync-events/{correlationId}
- POST /api/v1/integration/sap/callback

Implement:
- Configurable SAP destination
- OAuth token handling
- CSRF token handling when required
- OData pagination
- OData filtering and URL encoding
- Configurable field mapping
- Timeout
- Retry with exponential backoff and jitter
- Circuit breaker
- Idempotency
- Correlation ID
- Structured error handling
- Dead-letter handling
- Technical monitoring
- Manual reprocessing
- Complete integration audit
- Mock responses based on realistic but synthetic data

Do not permit direct browser-to-SAP communication.
All SAP calls must pass through the secured backend or approved integration layer.

Support these patterns:
1. Read a maintenance order from SAP and create a permit
2. Refresh permit header fields from SAP
3. Prevent overwriting PTW-controlled fields during synchronization
4. Optionally send the permit number and high-level status back to SAP
5. Handle SAP downtime without losing permit data
6. Clearly show stale SAP data and the last successful synchronization time

Create:
- docs/sap-integration.md
- docs/sap-field-mapping-template.csv
- docs/sap-connectivity-checklist.md
- docs/sap-error-handling.md

Use placeholders for:
- SAP base URL
- OData service name
- entity set
- OAuth token URL
- client ID
- scopes
- certificate alias
- communication arrangement
- Integration Suite endpoint

==================================================
4. DATABASE DESIGN
==================================================

Create normalized MySQL tables for at least:

- users
- roles
- user_roles
- user_authorizations
- delegations
- companies
- business_units
- plants
- functional_locations
- equipment
- work_centers
- permit_types
- permits
- permit_activities
- permit_workers
- contractors
- hazards
- controls
- risk_assessments
- risk_matrix_config
- permit_hazards
- isolations
- isolation_points
- gas_tests
- gas_test_readings
- toolbox_talks
- toolbox_talk_attendees
- workflow_definitions
- workflow_steps
- workflow_instances
- workflow_tasks
- workflow_history
- approval_matrix
- permit_extensions
- permit_suspensions
- shift_handovers
- shift_handover_items
- attachments
- notifications
- notification_outbox
- sap_systems
- sap_order_references
- sap_sync_events
- audit_events
- idempotency_keys

Database requirements:
- Use UUIDs for externally exposed identifiers
- Consider internal numeric keys only if justified
- Use foreign keys
- Add indexes based on actual query patterns
- Add created_at, created_by, updated_at, and updated_by where appropriate
- Add version columns for optimistic locking
- Store all timestamps in UTC
- Store the plant/site timezone separately
- Avoid storing binary attachments directly in MySQL
- Store attachment metadata and an object-storage reference
- Never hard-delete audit and workflow history
- Create Flyway migrations
- Include non-production seed data clearly marked as synthetic
- Create an entity relationship diagram using Mermaid

==================================================
5. SECURITY
==================================================

Follow:
- OWASP ASVS principles
- OWASP API Security principles
- Least privilege
- Defense in depth
- Secure by default
- Deny by default

Implement:
- Role-based and plant/location-based access
- Server-side authorization on every endpoint
- Input validation
- Output encoding
- Parameterized database access
- Secure file-upload validation
- File-size limits
- MIME-type validation
- Malware-scanning integration interface
- Rate limiting
- Security headers
- CORS allow-list
- CSRF protection where applicable
- Encrypted transport
- Encrypted sensitive configuration
- Log redaction
- Secure error responses
- Session and token expiration handling
- Protection against IDOR
- Protection against mass assignment
- Protection against SQL injection
- Protection against XSS
- Protection against SSRF, particularly in SAP and attachment integrations

Do not:
- Commit secrets
- Use hard-coded credentials
- Log tokens
- Put authorization decisions only in the UI
- Return stack traces to users
- Store files using user-provided file names
- Trust fields received from the frontend
- Automatically approve permits

Add:
- Threat model using STRIDE
- Security architecture document
- Data classification document
- Security testing checklist
- Dependency scanning
- Secret scanning
- Static analysis
- Software bill of materials generation

==================================================
6. API AND UI REQUIREMENTS
==================================================

Use REST APIs with:
- /api/v1 versioning
- Standard HTTP status codes
- RFC 7807-style problem responses
- OpenAPI documentation
- Pagination
- Sorting
- Filtering
- Correlation IDs
- Idempotency support for commands
- Consistent DTOs
- No direct exposure of database entities

Create UI screens for:
- Login
- Dashboard
- Permit search
- Permit creation wizard
- SAP work-order search
- Permit details
- Risk assessment
- Isolation and LOTO
- Gas test
- Approval inbox
- Workflow history
- Issue and receive permit
- Active permit control
- Suspension
- Extension
- Handback and closure
- Shift handover
- Administration
- Audit report
- Integration monitor

Design requirements:
- Responsive desktop and tablet layout
- Clear warning, error, pending, approved, active, suspended, and expired states
- Do not rely only on color
- Confirmation dialogs for critical actions
- Reason/comment required for critical transitions
- Unsaved-changes warning
- Accessible keyboard navigation
- Loading, empty, and error states
- Display the permit number, status, plant, location, risk, SAP order,
  validity period, and current approver prominently
- Show user timezone and plant timezone where dates may be ambiguous

==================================================
7. TESTING
==================================================

Create:
- Unit tests
- Repository tests
- Service tests
- Controller tests
- Security authorization tests
- Workflow transition tests
- SAP adapter contract tests
- Integration tests using Testcontainers with MySQL
- Frontend component tests
- End-to-end tests using Playwright
- Accessibility tests
- Negative tests
- Concurrency tests
- Idempotency tests

Include test cases for:
- Unauthorized plant access
- Requester attempting self-approval
- Approval from an invalid workflow state
- Concurrent approver actions
- Duplicate workflow command
- Permit activation without required isolation verification
- Permit activation without mandatory gas test
- Expired permit activation attempt
- Extension requiring risk reassessment
- SAP timeout
- SAP authentication failure
- SAP returning malformed data
- Notification failure
- Attachment with prohibited file type
- Audit record creation
- Closed permit modification attempt

Do not use production or personally identifiable data in tests.
Use synthetic test data.

==================================================
8. DEVOPS
==================================================

Create GitHub Actions workflows for:
- Backend build
- Frontend build
- Unit tests
- Integration tests
- End-to-end tests
- Linting
- Dependency vulnerability scanning
- Secret scanning
- Container-image scanning
- SBOM generation
- Build artifact publishing

Do not deploy automatically to production.
Production deployment must require an approved environment gate.

Create:
- Docker Compose for local development
- .env.example with placeholder values only
- Health and readiness checks
- Structured JSON logging
- Metrics
- Distributed tracing configuration
- Operational runbook
- Backup and restore guidance
- Disaster recovery guidance
- SAP outage runbook
- Notification failure runbook

==================================================
9. REQUIRED DOCUMENTATION
==================================================

Create:
- README.md
- docs/architecture.md
- docs/domain-model.md
- docs/workflow.md
- docs/security.md
- docs/threat-model.md
- docs/sap-integration.md
- docs/sap-field-mapping-template.csv
- docs/sap-connectivity-checklist.md
- docs/sap-error-handling.md
- docs/api.md
- docs/database.md
- docs/deployment.md
- docs/operations-runbook.md
- docs/testing.md
- docs/hse-validation-checklist.md
- docs/assumptions-and-open-questions.md

In the HSE validation checklist, explicitly state that competent HSE and
operations representatives must validate:
- Permit types
- Hazard catalog
- Risk matrix
- Gas limits
- Isolation rules
- Approval levels
- Shift handover rules
- Extension rules
- Suspension and resumption rules
- Permit validity
- Legal and regulatory requirements
- Record-retention period
- Emergency procedures

==================================================
10. IMPLEMENTATION SEQUENCE
==================================================

Follow this order:

Phase 1:
- Create architecture and assumptions
- Create repository structure
- Create Mermaid architecture diagrams
- Create backlog and acceptance criteria
- Create database ER diagram
- Create OpenAPI outline
- Do not implement business code yet

Phase 2:
- Create backend and frontend scaffolding
- Configure MySQL and Flyway
- Add Docker Compose
- Add health checks
- Add mock authentication

Phase 3:
- Implement users, roles, plant authorization, and master data

Phase 4:
- Implement permit creation, risk assessment, attachments, and validations

Phase 5:
- Implement workflow, approvals, notifications, and audit history

Phase 6:
- Implement isolation, gas testing, issue, activation, suspension,
  extension, handback, closure, and shift handover

Phase 7:
- Implement SAP gateway interface and mock adapter
- Add S/4HANA, ECC, and Integration Suite adapter skeletons
- Do not claim integration is complete until tested against the actual
  customer SAP metadata and connectivity

Phase 8:
- Implement dashboards, reports, and integration monitoring

Phase 9:
- Complete automated tests, security controls, documentation, and deployment

At the start of each phase:
1. Explain the files that will be created or modified.
2. Identify assumptions and risks.
3. Implement the smallest working increment.
4. Run build, lint, and tests.
5. Fix failures.
6. Summarize completed work and remaining items.

Start now with Phase 1 only.
Create the architecture, backlog, acceptance criteria, repository structure,
database ER diagram, OpenAPI outline, assumptions, and open questions.
Do not start Phase 2 until Phase 1 artifacts are complete.
