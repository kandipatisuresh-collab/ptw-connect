export function requireFields(value, fields) { for (const field of fields)
    if (value[field] === undefined || value[field] === null)
        throw new Error(`${field} is required.`); }
//# sourceMappingURL=safety-schemas.js.map