type DashboardPermit = {
  permitNumber: string;
  title: string;
  status: string;
  plannedStart: string;
  plannedEnd: string;
  area?: string;
  equipment?: string;
  workOrder?: string;
  permitType?: string;
};

type DashboardPageProps = {
  permits: readonly DashboardPermit[];
  loading: boolean;
  error: string;
  onCreatePermit: () => void;
  onOpenRegister: () => void;
  onOpenAdmin: () => void;
};

const samplePermits: DashboardPermit[] = [
  { permitNumber: 'PTW-2026-000101', title: 'Pump seal replacement', status: 'ACTIVE', plannedStart: '2026-10-18T08:00:00.000Z', plannedEnd: '2026-10-18T18:00:00.000Z', area: 'Pump Area 1', equipment: 'P-101', workOrder: '400012345', permitType: 'Hot Work' },
  { permitNumber: 'PTW-2026-000102', title: 'Motor feeder inspection', status: 'APPROVAL_PENDING', plannedStart: '2026-10-18T10:00:00.000Z', plannedEnd: '2026-10-18T16:00:00.000Z', area: 'Substation B', equipment: 'M-204', workOrder: '400012346', permitType: 'Electrical Work' },
  { permitNumber: 'PTW-2026-000103', title: 'Vessel internal inspection', status: 'SAFETY_REVIEW', plannedStart: '2026-10-19T06:00:00.000Z', plannedEnd: '2026-10-19T14:00:00.000Z', area: 'Process Unit 2', equipment: 'V-220', workOrder: '400012347', permitType: 'Confined Space' },
  { permitNumber: 'PTW-2026-000104', title: 'Pipe rack coating repair', status: 'ACTIVE', plannedStart: '2026-10-18T07:00:00.000Z', plannedEnd: '2026-10-18T15:00:00.000Z', area: 'Pipe Rack East', equipment: 'PR-08', workOrder: '400022345', permitType: 'Working at Height' },
  { permitNumber: 'PTW-2026-000105', title: 'Cooling line isolation', status: 'SUSPENDED', plannedStart: '2026-10-18T05:00:00.000Z', plannedEnd: '2026-10-18T13:00:00.000Z', area: 'Utilities', equipment: 'CL-32', workOrder: '400022346', permitType: 'General Maintenance' },
  { permitNumber: 'PTW-2026-000106', title: 'Workshop lifting operation', status: 'DRAFT', plannedStart: '2026-10-20T08:00:00.000Z', plannedEnd: '2026-10-20T12:00:00.000Z', area: 'Maintenance Shop', equipment: 'CR-02', workOrder: '400022347', permitType: 'Lifting' },
];

const reviewStatuses = new Set(['SUBMITTED', 'UNDER_REVIEW', 'SAFETY_REVIEW', 'ISOLATION_PENDING', 'APPROVAL_PENDING']);
const activeStatuses = new Set(['ACTIVE', 'ISSUED', 'RESUMED']);

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Schedule not set' : date.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function displayStatus(status: string): string {
  return status.toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function DashboardPage({ permits, loading, error, onCreatePermit, onOpenRegister, onOpenAdmin }: DashboardPageProps) {
  const isSample = permits.length === 0;
  const visiblePermits = isSample ? samplePermits : permits.map((permit) => ({
    ...permit,
    area: permit.area ?? 'Plant Area',
    equipment: permit.equipment ?? 'Equipment reference pending',
    workOrder: permit.workOrder ?? 'SAP order not linked',
    permitType: permit.permitType ?? 'Maintenance',
  }));

  const countStatus = (status: string) => visiblePermits.filter((permit) => permit.status === status).length;
  const reviewCount = visiblePermits.filter((permit) => reviewStatuses.has(permit.status)).length;
  const activeCount = visiblePermits.filter((permit) => activeStatuses.has(permit.status)).length;
  const suspendedCount = countStatus('SUSPENDED');
  const draftCount = countStatus('DRAFT');
  const statusGroups = [
    { label: 'Active', count: activeCount, className: 'active' },
    { label: 'In review', count: reviewCount, className: 'review' },
    { label: 'Suspended', count: suspendedCount, className: 'suspended' },
    { label: 'Draft', count: draftCount, className: 'draft' },
  ];
  const chartMax = Math.max(1, ...statusGroups.map((group) => group.count));
  const reviewQueue = visiblePermits.filter((permit) => reviewStatuses.has(permit.status)).slice(0, 3);
  const activeWork = visiblePermits.filter((permit) => activeStatuses.has(permit.status)).slice(0, 4);

  return (
    <main className="ptw-shell dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Permit control / Plant 1000</p>
          <h1>Operations dashboard</h1>
          <p className="muted">A current view of permit activity, reviews, and field work.</p>
        </div>
        <div className="dashboard-actions">
          <button className="secondary-button" type="button" onClick={onOpenRegister}>Permit register</button>
          <button className="secondary-button" type="button" onClick={onOpenAdmin}>Admin configuration</button>
          <button type="button" onClick={onCreatePermit}>Create permit</button>
        </div>
      </header>

      <div className={isSample ? 'dashboard-data-note sample' : 'dashboard-data-note'} role="note">
        <strong>{isSample ? 'Illustrative demo data' : 'Permit data'}</strong>
        <span>{isSample ? 'These sample permits are fictional and are not stored in the backend or connected to SAP.' : 'Permit counts are loaded from the current PTW API.'}</span>
        {error && <span className="dashboard-api-warning">API notice: {error}</span>}
      </div>

      {loading && <p className="dashboard-loading" role="status">Checking the permit register...</p>}

      <section className="dashboard-kpis" aria-label="Permit summary">
        <article className="dashboard-kpi total"><span>Total permits</span><strong>{visiblePermits.length}</strong><small>Across Plant 1000</small></article>
        <article className="dashboard-kpi review"><span>Pending review</span><strong>{reviewCount}</strong><small>Approval and safety queue</small></article>
        <article className="dashboard-kpi active"><span>Active work</span><strong>{activeCount}</strong><small>Currently in execution</small></article>
        <article className="dashboard-kpi suspended"><span>Suspended</span><strong>{suspendedCount}</strong><small>Requires follow-up</small></article>
      </section>

      <section className="dashboard-main-grid">
        <article className="dashboard-panel status-panel">
          <div className="dashboard-panel-heading"><div><p className="eyebrow">Portfolio</p><h2>Permit status</h2></div><span>{visiblePermits.length} total</span></div>
          <div className="status-bars" aria-label="Permits by status">
            {statusGroups.map((group) => (
              <div className="status-bar-row" key={group.label}>
                <span>{group.label}</span>
                <div className="status-bar-track"><div className={`status-bar-fill ${group.className}`} style={{ width: `${(group.count / chartMax) * 100}%` }} /></div>
                <strong>{group.count}</strong>
              </div>
            ))}
          </div>
          <div className="dashboard-panel-footer"><span>{draftCount} drafts awaiting completion</span><button className="inline-action" type="button" onClick={onOpenRegister}>View all permits</button></div>
        </article>

        <article className="dashboard-panel review-panel">
          <div className="dashboard-panel-heading"><div><p className="eyebrow">Next actions</p><h2>Review queue</h2></div><span className="queue-count">{reviewCount}</span></div>
          {reviewQueue.length ? <div className="dashboard-queue">{reviewQueue.map((permit) => (
            <div className="queue-row" key={permit.permitNumber}>
              <div><strong>{permit.permitNumber}</strong><h3>{permit.title}</h3><span>{permit.permitType ?? 'Maintenance'} · {permit.area ?? 'Plant Area'}</span></div>
              <span className={`status status-${permit.status.toLowerCase()}`}>{displayStatus(permit.status)}</span>
            </div>
          ))}</div> : <p className="dashboard-empty">No permits are waiting for review.</p>}
          <button className="inline-action" type="button" onClick={onOpenRegister}>Open review list</button>
        </article>
      </section>

      <section className="dashboard-panel active-panel">
        <div className="dashboard-panel-heading"><div><p className="eyebrow">Field execution</p><h2>Active work</h2></div><button className="inline-action" type="button" onClick={onOpenRegister}>Open register</button></div>
        {activeWork.length ? <div className="active-work-list">{activeWork.map((permit) => (
          <article className="active-work-row" key={permit.permitNumber}>
            <div className="work-id"><strong>{permit.permitNumber}</strong><span className={`status status-${permit.status.toLowerCase()}`}>{displayStatus(permit.status)}</span></div>
            <div className="work-description"><h3>{permit.title}</h3><span>{permit.permitType ?? 'Maintenance'} · {permit.equipment ?? 'Equipment reference pending'}</span></div>
            <div className="work-location"><span>Area</span><strong>{permit.area ?? 'Plant Area'}</strong></div>
            <div className="work-validity"><span>Planned start</span><strong>{formatDate(permit.plannedStart)}</strong></div>
            <div className="work-order"><span>SAP order</span><strong>{permit.workOrder ?? 'SAP order not linked'}</strong></div>
          </article>
        ))}</div> : <p className="dashboard-empty">There are no active permits.</p>}
      </section>
    </main>
  );
}