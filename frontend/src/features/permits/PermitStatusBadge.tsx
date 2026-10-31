export function PermitStatusBadge({ status }: { status: string }) { return <span className={`status status-${status.toLowerCase()}`}>{status}</span>; }
