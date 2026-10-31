export interface WorkflowView {
    permitId: string;
    status: string;
    pendingRoles: readonly string[];
}
export declare function workflowView(permitId: string, status: string, pendingRoles: readonly string[]): WorkflowView;
