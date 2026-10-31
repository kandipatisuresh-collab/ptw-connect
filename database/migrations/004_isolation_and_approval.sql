create table if not exists isolations (
  id uuid primary key default gen_random_uuid(), permit_id uuid not null references permits(id),
  isolation_point text not null, equipment text, isolation_type text not null,
  lock_number text, tag_number text, status text not null,
  applied_by uuid references users(id), verified_by uuid references users(id),
  applied_at timestamptz, verified_at timestamptz, released_at timestamptz
);

create table if not exists permit_approvals (
  id uuid primary key default gen_random_uuid(), permit_id uuid not null references permits(id),
  required_role text not null, approver_id uuid references users(id), decision text,
  comments text, decided_at timestamptz
);
