---
name: sap-s4hana-plant-maintenance
description: SAP S/4HANA Plant Maintenance domain guidance for PTW integration.
---

# SAP S/4HANA PM Skill

## Purpose
Integrate PTW with SAP S/4HANA Plant Maintenance without fabricating SAP APIs or business rules.

## Core SAP PM objects
Understand relationships among:
- Maintenance Notification
- Maintenance Order
- Maintenance Order Operation
- Equipment
- Functional Location
- Work Center
- Plant
- Planner Group
- Order type
- System/user status

## PTW relationship
A PTW permit may reference:
SAP Notification -> SAP Maintenance Order -> Operation -> Equipment/Functional Location.

Keep SAP business object identifiers distinct from internal PTW UUIDs.

## Integration principles
- Use a dedicated SAP adapter/service layer.
- Do not call SAP directly from UI components.
- Do not hard-code SAP credentials.
- Do not invent endpoint names.
- Treat SAP API availability as landscape-dependent.
- Prefer official released APIs/OData services where available.
- Map SAP status values explicitly rather than assuming meanings.
- Preserve SAP numbers as business keys.

## Recommended interfaces
Define interfaces such as:
SAPMaintenanceOrderService
SAPNotificationService
SAPEquipmentService
SAPFunctionalLocationService
SAPWorkCenterService

Use dependency injection so mock adapters can be used in tests.

## Error handling
Capture correlation ID, SAP object, operation, timestamps, status, error code and sanitized error message. Never log tokens or secrets.

## Important
Before implementing a real SAP connector, obtain the target S/4HANA release, API catalog, authentication method, and Integration Suite design from the SAP team.
