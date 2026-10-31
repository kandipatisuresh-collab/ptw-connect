create table if not exists sap_references (
  id uuid primary key default gen_random_uuid(), permit_id uuid not null references permits(id),
  object_type text not null, business_id text not null, source_snapshot jsonb not null,
  source_status text, retrieved_at timestamptz not null default now(), sync_state text not null
);
create table if not exists integration_transactions (
  id uuid primary key default gen_random_uuid(), correlation_id text not null, request_id text not null,
  object_type text not null, object_id text, status text not null, error_code text,
  error_message text, retry_count integer not null default 0, created_at timestamptz not null default now()
);
create index if not exists sap_references_business_idx on sap_references(object_type, business_id);
