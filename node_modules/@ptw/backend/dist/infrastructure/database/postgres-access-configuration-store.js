export class PostgresAccessConfigurationStore {
    database;
    constructor(database) {
        this.database = database;
    }
    async getSnapshot() {
        const [users, rolePermissions, workOrderMappings] = await Promise.all([
            this.listUsers(),
            this.listRolePermissions(),
            this.listWorkOrderMappings(),
        ]);
        return { users, rolePermissions, workOrderMappings };
    }
    async saveUserAssignment(input) {
        await this.database.transaction(async (transaction) => {
            const userRows = await transaction.query(`insert into users
          (user_code, identity_subject, entra_object_id, display_name, full_name, email, active, access_status, updated_at)
         values ($1, $2, $2, $3, $3, $4, $5, $6, now())
         on conflict (entra_object_id) where entra_object_id is not null
         do update set user_code = excluded.user_code,
                       display_name = excluded.display_name,
                       full_name = excluded.full_name,
                       email = excluded.email,
                       active = excluded.active,
                       access_status = excluded.access_status,
                       updated_at = now()
         returning id`, [input.userId, input.entraObjectId, input.fullName, input.email, input.status === 'Active', input.status]);
            const user = userRows[0];
            if (!user)
                throw new Error('User assignment could not be saved.');
            if (input.status !== 'Active') {
                await transaction.query('update user_roles set is_active = false where user_id = $1', [user.id]);
                return;
            }
            const roleRows = await transaction.query('select id from roles where name = $1 and active = true', [input.roleCode]);
            const role = roleRows[0];
            if (!role)
                throw new Error(`Unknown active PTW role: ${input.roleCode}`);
            await transaction.query(`insert into user_roles (user_id, role_id, plant_id, assigned_at, is_active)
         values ($1, $2, $3, now(), true)
         on conflict (user_id, role_id, plant_id)
         do update set is_active = true, assigned_at = now(), expires_at = null`, [user.id, role.id, input.plantId]);
        });
        const rows = await this.listUsers();
        const saved = rows.find((row) => row.userId === input.userId && row.roleCode === input.roleCode && row.plantId === input.plantId);
        return saved ?? { ...input, roleCode: input.status === 'Active' ? input.roleCode : '' };
    }
    async saveRolePermissions(roleCode, permissionCodes) {
        await this.database.transaction(async (transaction) => {
            const roleRows = await transaction.query('select id from roles where name = $1 and active = true', [roleCode]);
            const role = roleRows[0];
            if (!role)
                throw new Error(`Unknown active PTW role: ${roleCode}`);
            await transaction.query('delete from role_permissions where role_id = $1', [role.id]);
            for (const permissionCode of permissionCodes) {
                const permissionRows = await transaction.query(`insert into permissions (name, description)
           values ($1, '')
           on conflict (name) do update set name = excluded.name
           returning id`, [permissionCode]);
                const permission = permissionRows[0];
                if (!permission)
                    throw new Error(`Unknown permission: ${permissionCode}`);
                await transaction.query('insert into role_permissions (role_id, permission_id) values ($1, $2) on conflict do nothing', [role.id, permission.id]);
            }
        });
    }
    async saveWorkOrderMapping(input) {
        await this.database.transaction(async (transaction) => {
            const requester = await this.findUserForRole(transaction, input.requesterUserId, input.plantId, ['PERMIT_REQUESTER']);
            const approver = await this.findUserForRole(transaction, input.approverUserId, input.plantId, [
                'PTW_ADMIN', 'SAFETY_OFFICER', 'OPERATIONS_APPROVER', 'MAINTENANCE_SUPERVISOR', 'PLANT_MANAGER',
            ]);
            const issuer = await this.findUserForRole(transaction, input.issuerUserId, input.plantId, ['PTW_ADMIN', 'PERMIT_ISSUER']);
            await transaction.query(`insert into ptw_work_order_mapping
          (permit_number, sap_work_order_number, permit_type, requester_user_id, approver_user_id, issuer_user_id, plant_id)
         values ($1, $2, $3, $4, $5, $6, $7)`, [input.permitNumber, input.sapWorkOrderNumber, input.permitType, requester.id, approver.id, issuer.id, input.plantId]);
        });
        return input;
    }
    async listUsers() {
        return this.database.query(`select u.user_code as "userId",
              coalesce(u.full_name, u.display_name) as "fullName",
              coalesce(u.email, '') as email,
              coalesce(u.entra_object_id, u.identity_subject) as "entraObjectId",
              coalesce(r.name, '') as "roleCode",
              coalesce(ur.plant_id, '') as "plantId",
              u.access_status as status
       from users u
       left join user_roles ur on ur.user_id = u.id and ur.is_active = true and (ur.expires_at is null or ur.expires_at > now())
       left join roles r on r.id = ur.role_id
       where u.user_code is not null
       order by u.user_code, r.name, ur.plant_id`);
    }
    async listRolePermissions() {
        const rows = await this.database.query(`select r.name as "roleCode", p.name as "permissionCode"
       from roles r
       left join role_permissions rp on rp.role_id = r.id
       left join permissions p on p.id = rp.permission_id
       where r.active = true
       order by r.name, p.name`);
        const result = {};
        for (const row of rows) {
            result[row.roleCode] ??= [];
            if (row.permissionCode)
                result[row.roleCode] = [...(result[row.roleCode] ?? []), row.permissionCode];
        }
        return result;
    }
    async listWorkOrderMappings() {
        return this.database.query(`select m.permit_number as "permitNumber",
              m.sap_work_order_number as "sapWorkOrderNumber",
              m.permit_type as "permitType",
              requester.user_code as "requesterUserId",
              approver.user_code as "approverUserId",
              issuer.user_code as "issuerUserId",
              m.plant_id as "plantId"
       from ptw_work_order_mapping m
       join users requester on requester.id = m.requester_user_id
       join users approver on approver.id = m.approver_user_id
       join users issuer on issuer.id = m.issuer_user_id
       order by m.created_at desc`);
    }
    async findUserForRole(transaction, userCode, plantId, roleCodes) {
        const rows = await transaction.query(`select u.id
       from users u
       join user_roles ur on ur.user_id = u.id
       join roles r on r.id = ur.role_id
       where u.user_code = $1
         and u.active = true
         and u.access_status = 'Active'
         and ur.plant_id = $2
         and ur.is_active = true
         and (ur.expires_at is null or ur.expires_at > now())
         and r.active = true
         and r.name = any($3::text[])
       limit 1`, [userCode, plantId, [...roleCodes]]);
        const user = rows[0];
        if (!user)
            throw new Error(`User ${userCode} is not active with an eligible role at plant ${plantId}.`);
        return user;
    }
}
//# sourceMappingURL=postgres-access-configuration-store.js.map