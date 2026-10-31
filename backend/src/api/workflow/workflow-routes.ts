export interface WorkflowView { permitId: string; status: string; pendingRoles: readonly string[]; }
export function workflowView(permitId: string, status: string, pendingRoles: readonly string[]): WorkflowView { return { permitId, status, pendingRoles }; }
