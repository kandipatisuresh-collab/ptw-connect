export interface RiskMatrix {
    categories: readonly {
        min: number;
        max: number;
        name: 'Low' | 'Medium' | 'High' | 'Critical';
    }[];
}
export declare const defaultRiskMatrix: RiskMatrix;
export declare function calculateRisk(likelihood: number, severity: number, matrix?: RiskMatrix): {
    score: number;
    category: "Low" | "Medium" | "High" | "Critical";
    requiresAdditionalApproval: boolean;
};
