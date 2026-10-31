create table if not exists permit_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  active boolean not null default true,
  configuration jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists permits (
  id uuid primary key default gen_random_uuid(),
  permit_number text not null unique,
  permit_type_id uuid not null references permit_types(id),
  status text not null,
  requested_by uuid not null references users(id),
  plant_id text not null,
  area_id text not null,
  title text not null,
  work_description text not null,
  planned_start timestamptz not null,
  planned_end timestamptz not null,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint permits_planned_range check (planned_end > planned_start)
);

create table if not exists permit_status_history (
  id uuid primary key default gen_random_uuid(),
  permit_id uuid not null references permits(id),
  from_status text,
  to_status text not null,
  action text not null,
  actor_id uuid not null references users(id),
  correlation_id text not null,
  occurred_at timestamptz not null default now()
);

create index if not exists permits_scope_status_idx on permits(plant_id, area_id, status);
