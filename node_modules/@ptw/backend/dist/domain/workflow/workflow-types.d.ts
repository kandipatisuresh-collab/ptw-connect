import { PermitStatus } from '../shared/types.js';
export interface WorkflowTransition {
    from: PermitStatus;
    to: PermitStatus;
    requiredRoles: readonly string[];
    prerequisites: readonly string[];
}
export interface WorkflowTask {
    id: string;
    permitId: string;
    step: string;
    assignedRole: string;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}
