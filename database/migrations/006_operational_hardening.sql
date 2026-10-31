create index if not exists permits_status_date_idx on permits(status, planned_start, planned_end);
create index if not exists permit_status_history_permit_idx on permit_status_history(permit_id, occurred_at);
