export const defaultRiskMatrix = {
    categories: [
        { min: 1, max: 4, name: 'Low' },
        { min: 5, max: 9, name: 'Medium' },
        { min: 10, max: 16, name: 'High' },
        { min: 17, max: 25, name: 'Critical' },
    ],
};
export function calculateRisk(likelihood, severity, matrix = defaultRiskMatrix) {
    if (!Number.isInteger(likelihood) || !Number.isInteger(severity) || likelihood < 1 || likelihood > 5 || severity < 1 || severity > 5) {
        throw new Error('Likelihood and severity must be integers from 1 through 5.');
    }
    const score = likelihood * severity;
    const category = matrix.categories.find((item) => score >= item.min && score <= item.max);
    if (!category)
        throw new Error(`No risk category is configured for score ${score}.`);
    return { score, category: category.name, requiresAdditionalApproval: category.name === 'High' || category.name === 'Critical' };
}
//# sourceMappingURL=risk-matrix.js.map