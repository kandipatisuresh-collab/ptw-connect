export function OfflineStatus({ online }: { online: boolean }) { return <p role="status">{online ? 'Connected' : 'Offline: safe queued actions will synchronize later'}</p>; }
