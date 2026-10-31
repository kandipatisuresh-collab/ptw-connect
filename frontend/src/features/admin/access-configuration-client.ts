export type AccessStatus = 'Active' | 'Pending' | 'Inactive';

export type UserAssignment = {
  userId: string;
  fullName: string;
  email: string;
  entraObjectId: string;
  roleCode: string;
  plantId: string;
  status: AccessStatus;
};

export type WorkOrderMapping = {
  permitNumber: string;
  sapWorkOrderNumber: string;
  permitType: string;
  requesterUserId: string;
  approverUserId: string;
  issuerUserId: string;
  plantId: string;
};

export type AccessConfigurationSnapshot = {
  users: UserAssignment[];
  rolePermissions: Record<string, string[]>;
  workOrderMappings: WorkOrderMapping[];
};

export async function getAccessConfiguration(): Promise<AccessConfigurationSnapshot> {
  return request('/api/admin/configuration');
}

export async function saveUserAssignment(input: UserAssignment): Promise<UserAssignment> {
  return request('/api/admin/users', { method: 'POST', body: JSON.stringify(input) });
}

export async function saveRolePermissions(roleCode: string, permissionCodes: string[]): Promise<void> {
  await request(`/api/admin/roles/${encodeURIComponent(roleCode)}/permissions`, {
    method: 'PUT',
    body: JSON.stringify({ permissionCodes }),
  });
}

export async function saveWorkOrderMapping(input: WorkOrderMapping): Promise<WorkOrderMapping> {
  return request('/api/admin/work-order-mappings', { method: 'POST', body: JSON.stringify(input) });
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { 'content-type': 'application/json', ...init.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? `Request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}