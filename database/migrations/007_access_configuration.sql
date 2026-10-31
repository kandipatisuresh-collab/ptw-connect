alter table users add column if not exists user_code text;
alter table users add column if not exists entra_object_id text;
alter table users add column if not exists full_name text;
alter table users add column if not exists email text;
alter table users add column if not exists access_status text not null default 'Active';
alter table users add column if not exists last_login_at timestamptz;

update users
set entra_object_id = identity_subject
where entra_object_id is null;

update users
set full_name = display_name
where full_name is null;

update users
set access_status = case when active then 'Active' else 'Inactive' end;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'users_access_status_check'
      and conrelid = 'users'::regclass
  ) then
    alter table users add constraint users_access_status_check
      check (access_status in ('Active', 'Pending', 'Inactive'));
  end if;
end $$;

create unique index if not exists users_user_code_unique_idx
  on users(user_code) where user_code is not null;
create unique index if not exists users_entra_object_id_unique_idx
  on users(entra_object_id) where entra_object_id is not null;
create index if not exists users_email_idx on users(email);

alter table user_roles add column if not exists mapping_id uuid default gen_random_uuid();
alter table user_roles add column if not exists plant_id text;
alter table user_roles add column if not exists assigned_by uuid references users(id);
alter table user_roles add column if not exists assigned_at timestamptz not null default now();
alter table user_roles add column if not exists expires_at timestamptz;
alter table user_roles add column if not exists is_active boolean not null default true;

update user_roles set plant_id = 'UNSCOPED' where plant_id is null;
alter table user_roles alter column mapping_id set not null;
alter table user_roles alter column plant_id set not null;
alter table user_roles drop constraint if exists user_roles_pkey;
alter table user_roles add constraint user_roles_pkey primary key (mapping_id);
create unique index if not exists user_roles_user_role_plant_unique_idx
  on user_roles(user_id, role_id, plant_id);
create index if not exists user_roles_active_scope_idx
  on user_roles(user_id, plant_id) where is_active;

create table if not exists role_permissions (
  role_id uuid not null references roles(id) on delete cascade,
  permission_id uuid not null references permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create table if not exists ptw_work_order_mapping (
  mapping_id uuid primary key default gen_random_uuid(),
  permit_number text not null unique,
  sap_work_order_number text not null,
  permit_type text not null,
  requester_user_id uuid not null references users(id),
  approver_user_id uuid not null references users(id),
  issuer_user_id uuid not null references users(id),
  plant_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (permit_number, sap_work_order_number)
);

create index if not exists ptw_work_order_mapping_order_plant_idx
  on ptw_work_order_mapping(sap_work_order_number, plant_id);

insert into roles (name, description, active) values
  ('PTW_ADMIN', 'PTW configuration and administration', true),
  ('PERMIT_REQUESTER', 'Creates and submits permit requests', true),
  ('PERMIT_ISSUER', 'Issues and manages permit execution', true),
  ('SAFETY_OFFICER', 'Reviews safety controls and risk', true),
  ('OPERATIONS_APPROVER', 'Approves operational permits', true),
  ('MAINTENANCE_SUPERVISOR', 'Reviews maintenance permits', true),
  ('PLANT_MANAGER', 'Plant-level oversight and approvals', true),
  ('READ_ONLY_AUDITOR', 'Read-only permit, report, and audit access', true),
  ('CONTRACTOR', 'Contractor access subject to configured scope', true)
on conflict (name) do update set description = excluded.description, active = true;

insert into permissions (name, description) values
  ('PERMIT_CREATE', 'Create permits'),
  ('PERMIT_EDIT', 'Edit draft permits'),
  ('PERMIT_SUBMIT', 'Submit permits for review'),
  ('PERMIT_VIEW', 'View permits'),
  ('PERMIT_APPROVE', 'Approve permits'),
  ('PERMIT_REJECT', 'Reject permits'),
  ('PERMIT_ISSUE', 'Issue permits'),
  ('PERMIT_SUSPEND', 'Suspend permits'),
  ('PERMIT_RESUME', 'Resume permits'),
  ('PERMIT_EXTEND', 'Extend permits'),
  ('PERMIT_CLOSE', 'Close permits'),
  ('PERMIT_CANCEL', 'Cancel permits'),
  ('ACCESS_REQUEST_VIEW', 'View access requests'),
  ('ACCESS_REQUEST_APPROVE', 'Approve access requests'),
  ('ACCESS_REQUEST_REJECT', 'Reject access requests'),
  ('USER_MANAGE', 'Manage users'),
  ('ROLE_MANAGE', 'Manage roles'),
  ('ADMIN_ACCESS', 'Access administration screens'),
  ('WORKFLOW_MANAGE', 'Manage workflows'),
  ('AUDIT_VIEW', 'View audit records'),
  ('REPORT_VIEW', 'View reports')
on conflict (name) do update set description = excluded.description;

insert into role_permissions (role_id, permission_id)
select role_row.id, permission_row.id
from roles role_row
cross join permissions permission_row
where role_row.name = 'PTW_ADMIN'
on conflict do nothing;

insert into role_permissions (role_id, permission_id)
select role_row.id, permission_row.id
from (values
  ('PERMIT_REQUESTER', 'PERMIT_CREATE'),
  ('PERMIT_REQUESTER', 'PERMIT_EDIT'),
  ('PERMIT_REQUESTER', 'PERMIT_SUBMIT'),
  ('PERMIT_REQUESTER', 'PERMIT_VIEW'),
  ('PERMIT_ISSUER', 'PERMIT_VIEW'),
  ('PERMIT_ISSUER', 'PERMIT_ISSUE'),
  ('PERMIT_ISSUER', 'PERMIT_SUSPEND'),
  ('PERMIT_ISSUER', 'PERMIT_RESUME'),
  ('PERMIT_ISSUER', 'PERMIT_CLOSE'),
  ('SAFETY_OFFICER', 'PERMIT_VIEW'),
  ('SAFETY_OFFICER', 'PERMIT_APPROVE'),
  ('SAFETY_OFFICER', 'PERMIT_REJECT'),
  ('SAFETY_OFFICER', 'PERMIT_SUSPEND'),
  ('SAFETY_OFFICER', 'AUDIT_VIEW'),
  ('OPERATIONS_APPROVER', 'PERMIT_VIEW'),
  ('OPERATIONS_APPROVER', 'PERMIT_APPROVE'),
  ('OPERATIONS_APPROVER', 'PERMIT_REJECT'),
  ('MAINTENANCE_SUPERVISOR', 'PERMIT_CREATE'),
  ('MAINTENANCE_SUPERVISOR', 'PERMIT_VIEW'),
  ('MAINTENANCE_SUPERVISOR', 'PERMIT_APPROVE'),
  ('PLANT_MANAGER', 'PERMIT_VIEW'),
  ('PLANT_MANAGER', 'PERMIT_APPROVE'),
  ('PLANT_MANAGER', 'REPORT_VIEW'),
  ('READ_ONLY_AUDITOR', 'PERMIT_VIEW'),
  ('READ_ONLY_AUDITOR', 'REPORT_VIEW'),
  ('READ_ONLY_AUDITOR', 'AUDIT_VIEW')
) as defaults(role_name, permission_name)
join roles role_row on role_row.name = defaults.role_name
join permissions permission_row on permission_row.name = defaults.permission_name
on conflict do nothing;