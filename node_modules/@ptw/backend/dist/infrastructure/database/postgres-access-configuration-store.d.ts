import type { AccessConfigurationSnapshot, AccessConfigurationStore, UserAssignmentInput, WorkOrderMappingInput } from '../../application/admin/access-configuration-store.js';
import type { DatabaseConnection } from './connection.js';
export declare class PostgresAccessConfigurationStore implements AccessConfigurationStore {
    private readonly database;
    constructor(database: DatabaseConnection);
    getSnapshot(): Promise<AccessConfigurationSnapshot>;
    saveUserAssignment(input: UserAssignmentInput): Promise<UserAssignmentInput>;
    saveRolePermissions(roleCode: string, permissionCodes: readonly string[]): Promise<void>;
    saveWorkOrderMapping(input: WorkOrderMappingInput): Promise<WorkOrderMappingInput>;
    private listUsers;
    private listRolePermissions;
    private listWorkOrderMappings;
    private findUserForRole;
}
