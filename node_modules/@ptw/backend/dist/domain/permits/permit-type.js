export const initialPermitTypes = [
    'COLD_WORK', 'HOT_WORK', 'CONFINED_SPACE', 'ELECTRICAL', 'EXCAVATION', 'WORKING_AT_HEIGHT', 'LINE_BREAKING', 'RADIATION', 'LIFTING', 'VEHICLE_ENTRY', 'GENERAL_MAINTENANCE',
].map((code) => ({ id: code.toLowerCase(), code, name: code.replaceAll('_', ' '), active: true, configuration: {} }));
//# sourceMappingURL=permit-type.js.map