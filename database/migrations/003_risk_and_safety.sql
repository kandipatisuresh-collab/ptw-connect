create table if not exists risk_assessments (
  id uuid primary key default gen_random_uuid(),
  permit_id uuid not null references permits(id),
  hazard text not null,
  likelihood integer not null check (likelihood between 1 and 5),
  severity integer not null check (severity between 1 and 5),
  initial_score integer not null,
  residual_score integer,
  category text not null,
  created_at timestamptz not null default now()
);

create table if not exists gas_tests (
  id uuid primary key default gen_random_uuid(), permit_id uuid not null references permits(id),
  tester_id uuid not null references users(id), tested_at timestamptz not null,
  oxygen numeric not null, lel numeric not null, h2s numeric not null, co numeric not null,
  instrument_id text not null, calibration_date date not null, passed boolean not null,
  warnings jsonb not null default '[]'::jsonb
);

create table if not exists checklist_responses (
  id uuid primary key default gen_random_uuid(), permit_id uuid not null references permits(id),
  item_id text not null, response text not null check (response in ('YES', 'NO', 'N/A')),
  comment text, responded_by uuid not null references users(id), responded_at timestamptz not null default now()
);
