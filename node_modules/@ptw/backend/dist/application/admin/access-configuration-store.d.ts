export type AccessStatus = 'Active' | 'Pending' | 'Inactive';
export interface UserAssignmentInput {
    userId: string;
    fullName: string;
    email: string;
    entraObjectId: string;
    roleCode: string;
    plantId: string;
    status: AccessStatus;
}
export interface WorkOrderMappingInput {
    permitNumber: string;
    sapWorkOrderNumber: string;
    permitType: string;
    requesterUserId: string;
    approverUserId: string;
    issuerUserId: string;
    plantId: string;
}
export interface AccessConfigurationSnapshot {
    users: readonly UserAssignmentInput[];
    rolePermissions: Readonly<Record<string, readonly string[]>>;
    workOrderMappings: readonly WorkOrderMappingInput[];
}
export interface AccessConfigurationStore {
    getSnapshot(): Promise<AccessConfigurationSnapshot>;
    saveUserAssignment(input: UserAssignmentInput): Promise<UserAssignmentInput>;
    saveRolePermissions(roleCode: string, permissionCodes: readonly string[]): Promise<void>;
    saveWorkOrderMapping(input: WorkOrderMappingInput): Promise<WorkOrderMappingInput>;
}
