import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
  getAccessConfiguration,
  saveRolePermissions as persistRolePermissions,
  saveUserAssignment as persistUserAssignment,
  saveWorkOrderMapping as persistWorkOrderMapping,
} from './access-configuration-client.js';

const roles = [
  { code: 'PTW_ADMIN', name: 'PTW Admin' },
  { code: 'PERMIT_REQUESTER', name: 'Permit Requester' },
  { code: 'PERMIT_ISSUER', name: 'Permit Issuer' },
  { code: 'SAFETY_OFFICER', name: 'Safety Officer' },
  { code: 'OPERATIONS_APPROVER', name: 'Operations Approver' },
  { code: 'MAINTENANCE_SUPERVISOR', name: 'Maintenance Supervisor' },
  { code: 'PLANT_MANAGER', name: 'Plant Manager' },
  { code: 'READ_ONLY_AUDITOR', name: 'Read-Only Auditor' },
  { code: 'CONTRACTOR', name: 'Contractor' },
] as const;

const approverRoleCodes = ['PTW_ADMIN', 'SAFETY_OFFICER', 'OPERATIONS_APPROVER', 'MAINTENANCE_SUPERVISOR', 'PLANT_MANAGER'];
const issuerRoleCodes = ['PTW_ADMIN', 'PERMIT_ISSUER'];

const permissions = [
  { code: 'PERMIT_CREATE', name: 'Create permits' },
  { code: 'PERMIT_EDIT', name: 'Edit permits' },
  { code: 'PERMIT_SUBMIT', name: 'Submit permits' },
  { code: 'PERMIT_VIEW', name: 'View permits' },
  { code: 'PERMIT_APPROVE', name: 'Approve permits' },
  { code: 'PERMIT_ISSUE', name: 'Issue permits' },
  { code: 'PERMIT_SUSPEND', name: 'Suspend permits' },
  { code: 'PERMIT_RESUME', name: 'Resume permits' },
  { code: 'PERMIT_EXTEND', name: 'Extend permits' },
  { code: 'PERMIT_CLOSE', name: 'Close permits' },
  { code: 'PERMIT_CANCEL', name: 'Cancel permits' },
  { code: 'ADMIN_ACCESS', name: 'Access administration screens' },
  { code: 'ACCESS_REQUEST_APPROVE', name: 'Approve access requests' },
  { code: 'ACCESS_REQUEST_VIEW', name: 'View access requests' },
  { code: 'ACCESS_REQUEST_REJECT', name: 'Reject access requests' },
  { code: 'USER_MANAGE', name: 'Manage users' },
  { code: 'ROLE_MANAGE', name: 'Manage roles and permissions' },
  { code: 'WORKFLOW_MANAGE', name: 'Manage workflows' },
  { code: 'AUDIT_VIEW', name: 'View audit records' },
  { code: 'REPORT_VIEW', name: 'View reports' },
] as const;

type UserEntry = {
  userId: string;
  fullName: string;
  email: string;
  entraObjectId: string;
  roleCode: string;
  plantId: string;
  status: 'Active' | 'Pending' | 'Inactive';
};

type WorkOrderEntry = {
  permitNumber: string;
  sapWorkOrderNumber: string;
  permitType: string;
  requesterUserId: string;
  approverUserId: string;
  issuerUserId: string;
  plantId: string;
};

type ConfigurationTab = 'users' | 'permissions' | 'work-orders';

const initialPermissions: Record<string, string[]> = {
  PTW_ADMIN: permissions.map((permission) => permission.code),
  PERMIT_REQUESTER: ['PERMIT_CREATE', 'PERMIT_EDIT', 'PERMIT_SUBMIT', 'PERMIT_VIEW'],
  PERMIT_ISSUER: ['PERMIT_VIEW', 'PERMIT_ISSUE', 'PERMIT_SUSPEND', 'PERMIT_RESUME', 'PERMIT_CLOSE'],
  SAFETY_OFFICER: ['PERMIT_VIEW', 'PERMIT_APPROVE', 'PERMIT_SUSPEND', 'AUDIT_VIEW'],
  OPERATIONS_APPROVER: ['PERMIT_VIEW', 'PERMIT_APPROVE'],
  MAINTENANCE_SUPERVISOR: ['PERMIT_CREATE', 'PERMIT_VIEW', 'PERMIT_APPROVE'],
  PLANT_MANAGER: ['PERMIT_VIEW', 'PERMIT_APPROVE'],
  READ_ONLY_AUDITOR: ['PERMIT_VIEW', 'REPORT_VIEW', 'AUDIT_VIEW'],
  CONTRACTOR: [],
};

function optionRoleName(code: string): string {
  return roles.find((role) => role.code === code)?.name ?? code;
}

function eligibleUsers(users: UserEntry[], roleCodes: readonly string[]): UserEntry[] {
  const seen = new Set<string>();
  return users.filter((user) => user.status === 'Active' && roleCodes.includes(user.roleCode))
    .filter((user) => {
      const assignment = `${user.userId}:${user.plantId}`;
      if (seen.has(assignment)) return false;
      seen.add(assignment);
      return true;
    });
}

export function AccessConfigurationPage({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<ConfigurationTab>(() => {
    const tab = new URLSearchParams(window.location.search).get('config');
    return tab === 'permissions' || tab === 'work-orders' ? tab : 'users';
  });
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrderEntry[]>([]);
  const [rolePermissions, setRolePermissions] = useState(initialPermissions);
  const [selectedRole, setSelectedRole] = useState<string>(roles[0].code);
  const [editingPermissions, setEditingPermissions] = useState<string[]>(initialPermissions[roles[0].code] ?? []);
  const [notice, setNotice] = useState('');
  const [formError, setFormError] = useState('');
  const [persistenceReady, setPersistenceReady] = useState(false);
  const [persistenceError, setPersistenceError] = useState('Connecting to PostgreSQL...');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getAccessConfiguration()
      .then((snapshot) => {
        if (!active) return;
        setUsers(snapshot.users);
        setWorkOrders(snapshot.workOrderMappings);
        setRolePermissions({ ...initialPermissions, ...snapshot.rolePermissions });
        setEditingPermissions(snapshot.rolePermissions[selectedRole] ?? initialPermissions[selectedRole] ?? []);
        setPersistenceReady(true);
        setPersistenceError('');
      })
      .catch((reason: Error) => {
        if (!active) return;
        setPersistenceError(reason.message);
      });
    return () => { active = false; };
  }, []);

  const addUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const user: UserEntry = {
      userId: String(form.get('userId')).trim(),
      fullName: String(form.get('fullName')).trim(),
      email: String(form.get('email')).trim().toLowerCase(),
      entraObjectId: String(form.get('entraObjectId')).trim(),
      roleCode: String(form.get('roleCode')),
      plantId: String(form.get('plantId')).trim(),
      status: String(form.get('status')) as UserEntry['status'],
    };

    const identityConflict = users.some((existing) =>
      (existing.userId === user.userId || existing.email === user.email || existing.entraObjectId === user.entraObjectId)
      && !(existing.userId === user.userId && existing.email === user.email && existing.entraObjectId === user.entraObjectId));
    if (identityConflict) {
      setFormError('User ID, email, and Entra Object ID must identify the same user.');
      return;
    }
    if (users.some((existing) => existing.entraObjectId === user.entraObjectId && existing.roleCode === user.roleCode && existing.plantId === user.plantId)) {
      setFormError('That user already has this role at this plant.');
      return;
    }

    setFormError('');
    setSaving(true);
    try {
      const saved = await persistUserAssignment(user);
      setUsers((current) => [...current.filter((existing) => !(existing.userId === saved.userId && existing.roleCode === saved.roleCode && existing.plantId === saved.plantId)), saved]);
      formElement.reset();
      setNotice(`Saved ${saved.fullName} role assignment to PostgreSQL.`);
    } catch (reason) {
      setFormError(reason instanceof Error ? reason.message : 'User assignment could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const saveRolePermissions = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await persistRolePermissions(selectedRole, editingPermissions);
      setRolePermissions((current) => ({ ...current, [selectedRole]: editingPermissions }));
      setNotice(`Saved ${optionRoleName(selectedRole)} permissions to PostgreSQL.`);
    } catch (reason) {
      setFormError(reason instanceof Error ? reason.message : 'Role permissions could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const addWorkOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const mapping: WorkOrderEntry = {
      permitNumber: String(form.get('permitNumber')).trim(),
      sapWorkOrderNumber: String(form.get('sapWorkOrderNumber')).trim(),
      permitType: String(form.get('permitType')),
      requesterUserId: String(form.get('requesterUserId')),
      approverUserId: String(form.get('approverUserId')),
      issuerUserId: String(form.get('issuerUserId')),
      plantId: String(form.get('plantId')).trim(),
    };

    const requester = users.find((user) => user.userId === mapping.requesterUserId);
    const approver = users.find((user) => user.userId === mapping.approverUserId);
    const issuer = users.find((user) => user.userId === mapping.issuerUserId);
    if (!requester || requester.roleCode !== 'PERMIT_REQUESTER'
      || !approver || !approverRoleCodes.includes(approver.roleCode)
      || !issuer || !issuerRoleCodes.includes(issuer.roleCode)) {
      setFormError('Select an active requester, approver, and issuer with matching PTW roles.');
      return;
    }

    if ([requester, approver, issuer].some((user) => user.plantId !== mapping.plantId)) {
      setFormError('Requester, approver, issuer, and permit mapping must use the same plant.');
      return;
    }

    if (workOrders.some((existing) => existing.permitNumber === mapping.permitNumber)) {
      setFormError('That PTW number is already mapped in this session.');
      return;
    }

    setFormError('');
    setSaving(true);
    try {
      const saved = await persistWorkOrderMapping(mapping);
      setWorkOrders((current) => [...current, saved]);
      formElement.reset();
      setNotice(`Saved work-order mapping for ${saved.permitNumber} to PostgreSQL.`);
    } catch (reason) {
      setFormError(reason instanceof Error ? reason.message : 'Work-order mapping could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const userName = (userId: string) => users.find((user) => user.userId === userId)?.fullName ?? userId;
  const selectTab = (tab: ConfigurationTab) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('config', tab);
    window.history.replaceState(null, '', url);
    setNotice('');
    setFormError('');
  };

  return (
    <main className="ptw-shell admin-config-shell">
      <header className="config-header">
        <div>
          <p className="eyebrow">Administration</p>
          <h1>Access configuration</h1>
          <p className="muted">Enter demo users, configure role permissions, and link permits to SAP work orders.</p>
        </div>
        <button className="secondary-button" type="button" onClick={onBack}>Back to register</button>
      </header>

      <aside className="demo-notice" role="note">
        <strong>Development configuration only</strong>
        <span>Writes persist in PostgreSQL when the development admin API is enabled. These settings do not provide production authorization or update SAP records.</span>
      </aside>

      {!persistenceReady && <p className="message error" role="alert">{persistenceError} Set DATABASE_URL, apply migrations, and enable PTW_DEMO_ADMIN_ENABLED for local development.</p>}

      <nav className="config-tabs" aria-label="Configuration forms">
        <button type="button" aria-pressed={activeTab === 'users'} onClick={() => selectTab('users')}>Users &amp; Plant Roles</button>
        <button type="button" aria-pressed={activeTab === 'permissions'} onClick={() => selectTab('permissions')}>Role Permissions</button>
        <button type="button" aria-pressed={activeTab === 'work-orders'} onClick={() => selectTab('work-orders')}>Work Order Mapping</button>
      </nav>

      {notice && <p className="config-feedback" role="status">{notice}</p>}
      {formError && <p className="message error" role="alert">{formError}</p>}

      {activeTab === 'users' && (
        <section className="config-section" aria-labelledby="user-form-title">
          <div className="config-section-heading">
            <div><p className="eyebrow">User registry</p><h2 id="user-form-title">Add user and plant role</h2></div>
            <span>{users.length} role assignments</span>
          </div>
          <form className="config-form" onSubmit={addUser}>
            <label>User ID<input name="userId" placeholder="U001" required /></label>
            <label>Full name<input name="fullName" autoComplete="name" required /></label>
            <label>Work email<input name="email" type="email" autoComplete="email" required /></label>
            <label>Entra Object ID<input name="entraObjectId" pattern="[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" required /></label>
            <label>PTW role<select name="roleCode" defaultValue="PERMIT_REQUESTER">{roles.map((role) => <option key={role.code} value={role.code}>{role.name}</option>)}</select></label>
            <label>Plant ID<input name="plantId" placeholder="1000" required /></label>
            <label>Access status<select name="status" defaultValue="Active"><option>Active</option><option>Pending</option><option>Inactive</option></select></label>
            <button type="submit" disabled={!persistenceReady || saving}>{saving ? 'Saving...' : 'Add user assignment'}</button>
          </form>
          <div className="config-table-wrap">
            <table>
              <thead><tr><th>User ID</th><th>Name</th><th>Email</th><th>PTW role</th><th>Plant</th><th>Status</th></tr></thead>
              <tbody>{users.length === 0 ? <tr><td colSpan={6}>No user assignments stored.</td></tr> : users.map((user) => <tr key={`${user.userId}-${user.roleCode}-${user.plantId}`}><td>{user.userId}</td><td>{user.fullName}</td><td>{user.email}</td><td>{user.roleCode ? optionRoleName(user.roleCode) : 'No role assigned'}</td><td>{user.plantId || '—'}</td><td>{user.status}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'permissions' && (
        <section className="config-section" aria-labelledby="permission-form-title">
          <div className="config-section-heading">
            <div><p className="eyebrow">Authorization model</p><h2 id="permission-form-title">Configure role permissions</h2></div>
            <span>{rolePermissions[selectedRole]?.length ?? 0} permissions selected</span>
          </div>
          <form className="config-form permission-form" onSubmit={saveRolePermissions}>
            <label>PTW role<select value={selectedRole} onChange={(event) => {
              const roleCode = event.target.value;
              setSelectedRole(roleCode);
              setEditingPermissions(rolePermissions[roleCode] ?? []);
            }}>{roles.map((role) => <option key={role.code} value={role.code}>{role.name}</option>)}</select></label>
            <fieldset>
              <legend>Allowed actions</legend>
              <div className="permission-options">
                {permissions.map((permission) => (
                  <label key={permission.code}>
                    <input name="permissions" type="checkbox" value={permission.code} checked={editingPermissions.includes(permission.code)} onChange={(event) => {
                      setEditingPermissions((current) => event.target.checked
                        ? [...current, permission.code]
                        : current.filter((code) => code !== permission.code));
                    }} />
                    <span>{permission.name}<small>{permission.code}</small></span>
                  </label>
                ))}
              </div>
            </fieldset>
            <button type="submit" disabled={!persistenceReady || saving}>{saving ? 'Saving...' : 'Save role permissions'}</button>
          </form>
          <div className="config-table-wrap">
            <table>
              <thead><tr><th>Role</th><th>Configured permissions</th></tr></thead>
              <tbody>{roles.map((role) => <tr key={role.code}><td>{role.name}</td><td>{(rolePermissions[role.code] ?? []).map((code) => permissions.find((permission) => permission.code === code)?.name ?? code).join(', ') || 'No permissions'}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'work-orders' && (
        <section className="config-section" aria-labelledby="work-order-form-title">
          <div className="config-section-heading">
            <div><p className="eyebrow">SAP PM reference</p><h2 id="work-order-form-title">Map a work order to a permit</h2></div>
            <span>{workOrders.length} saved mappings</span>
          </div>
          <form className="config-form" onSubmit={addWorkOrder}>
            <label>PTW number<input name="permitNumber" placeholder="PTW-2026-000101" required /></label>
            <label>SAP work order<input name="sapWorkOrderNumber" placeholder="400012345" required /></label>
            <label>Permit type<select name="permitType" defaultValue="Hot Work">{['Hot Work', 'Electrical Work', 'Confined Space', 'Working at Height', 'General Maintenance'].map((type) => <option key={type}>{type}</option>)}</select></label>
            <label>Plant ID<input name="plantId" placeholder="1000" required /></label>
            <label>Requester<select name="requesterUserId" required defaultValue=""><option value="" disabled>{users.length ? 'Select requester' : 'Add users first'}</option>{eligibleUsers(users, ['PERMIT_REQUESTER']).map((user) => <option key={`${user.userId}-${user.plantId}`} value={user.userId}>{user.fullName} · {user.plantId}</option>)}</select></label>
            <label>Approver<select name="approverUserId" required defaultValue=""><option value="" disabled>{users.length ? 'Select approver' : 'Add users first'}</option>{eligibleUsers(users, approverRoleCodes).map((user) => <option key={`${user.userId}-${user.plantId}`} value={user.userId}>{user.fullName} · {user.plantId}</option>)}</select></label>
            <label>Issuer<select name="issuerUserId" required defaultValue=""><option value="" disabled>{users.length ? 'Select issuer' : 'Add users first'}</option>{eligibleUsers(users, issuerRoleCodes).map((user) => <option key={`${user.userId}-${user.plantId}`} value={user.userId}>{user.fullName} · {user.plantId}</option>)}</select></label>
            <button type="submit" disabled={!persistenceReady || saving || users.length === 0}>{saving ? 'Saving...' : 'Save work order mapping'}</button>
          </form>
          <div className="config-table-wrap">
            <table>
              <thead><tr><th>PTW number</th><th>SAP order</th><th>Type</th><th>Requester</th><th>Approver</th><th>Issuer</th><th>Plant</th></tr></thead>
              <tbody>{workOrders.length === 0 ? <tr><td colSpan={7}>No work-order mappings stored.</td></tr> : workOrders.map((mapping) => <tr key={mapping.permitNumber}><td>{mapping.permitNumber}</td><td>{mapping.sapWorkOrderNumber}</td><td>{mapping.permitType}</td><td>{userName(mapping.requesterUserId)}</td><td>{userName(mapping.approverUserId)}</td><td>{userName(mapping.issuerUserId)}</td><td>{mapping.plantId}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}