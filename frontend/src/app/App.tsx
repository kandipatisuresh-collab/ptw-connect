import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { AccessConfigurationPage } from '../features/admin/AccessConfigurationPage.js';
import { DashboardPage } from '../features/dashboard/DashboardPage.js';
import { PermitCreatePage } from '../features/permits/PermitCreatePage.js';

type Permit = {
  permitNumber: string;
  title: string;
  status: string;
  plannedStart: string;
  plannedEnd: string;
};

const demoActorHeaders = {
  'x-ptw-user': 'demo-user',
  'x-ptw-role': 'Read-Only/Auditor',
  'x-ptw-plant': 'plant-1',
  'x-ptw-area': 'area-1',
};

async function fetchPermits(): Promise<Permit[]> {
  const response = await fetch('/api/permits', { headers: demoActorHeaders });
  if (!response.ok) throw new Error('Unable to load permits.');
  return response.json() as Promise<Permit[]>;
}

function getConfigTabFromUrl(): 'users' | 'permissions' | 'work-orders' | null {
  const tab = new URLSearchParams(window.location.search).get('config');
  return tab === 'users' || tab === 'permissions' || tab === 'work-orders' ? tab : null;
}

function setConfigTabInUrl(tab?: 'users' | 'permissions' | 'work-orders') {
  const url = new URL(window.location.href);
  if (tab) url.searchParams.set('config', tab);
  else url.searchParams.delete('config');
  window.history.replaceState(null, '', url);
}

type MainView = 'dashboard' | 'permits';

function getMainViewFromUrl(): MainView {
  return new URLSearchParams(window.location.search).get('view') === 'permits' ? 'permits' : 'dashboard';
}

function setMainViewInUrl(view: MainView) {
  const url = new URL(window.location.href);
  url.searchParams.delete('config');
  if (view === 'permits') url.searchParams.set('view', 'permits');
  else url.searchParams.delete('view');
  window.history.replaceState(null, '', url);
}

export function App() {
  const [permits, setPermits] = useState<Permit[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationSent, setRegistrationSent] = useState(false);
  const [showPermitForm, setShowPermitForm] = useState(false);
  const [showAdminConfig, setShowAdminConfig] = useState(() => getConfigTabFromUrl() !== null);
  const [mainView, setMainView] = useState<MainView>(getMainViewFromUrl);

  useEffect(() => {
    let active = true;
    fetchPermits()
      .then((result) => {
        if (active) setPermits(result);
      })
      .catch((reason: Error) => {
        if (active) setError(reason.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const submitRegistration = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRegistrationSent(true);
  };

  const refreshPermits = async () => {
    setLoading(true);
    try {
      setPermits(await fetchPermits());
      setError('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load permits.');
    } finally {
      setLoading(false);
    }
  };

  const openRegister = () => {
    setMainViewInUrl('permits');
    setMainView('permits');
  };

  if (showAdminConfig) {
    return <AccessConfigurationPage onBack={() => {
      setConfigTabInUrl();
      setShowAdminConfig(false);
    }} />;
  }

  if (showPermitForm) {
    return (
      <main className="ptw-shell permit-create-shell">
        <div className="demo-notice" role="note">
          <strong>Local demo mode</strong>
          <span>This form is not protected by Microsoft sign-in or administrator approval. Do not use it for real work permits.</span>
        </div>
        <button className="back-button" type="button" onClick={() => { setShowPermitForm(false); openRegister(); }}>
          Back to permit register
        </button>
        <div className="permit-create-panel">
          <PermitCreatePage onCreated={() => {
            setShowPermitForm(false);
            void refreshPermits();
          }} />
        </div>
      </main>
    );
  }

  if (mainView === 'dashboard') {
    return <DashboardPage
      permits={permits}
      loading={loading}
      error={error}
      onCreatePermit={() => { openRegister(); setShowPermitForm(true); }}
      onOpenRegister={openRegister}
      onOpenAdmin={() => {
        setConfigTabInUrl('users');
        setShowAdminConfig(true);
      }}
    />;
  }

  return (
    <main className="ptw-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Permit control</p>
          <h1>Active work register</h1>
          <p className="muted">Review status, validity, and location before work begins.</p>
        </div>
        <div className="header-actions">
          <button className="secondary-button" type="button" onClick={() => { setMainViewInUrl('dashboard'); setMainView('dashboard'); }}>Dashboard</button>
          <button className="secondary-button" type="button" onClick={() => {
            setConfigTabInUrl('users');
            setShowAdminConfig(true);
          }}>Admin configuration (demo)</button>
          <button className="secondary-button" type="button" onClick={() => {
            setShowRegistration(true);
            setRegistrationSent(false);
          }}>
            Register / request access
          </button>
        </div>
      </header>

      <section className="toolbar">
        <strong>{loading ? 'Loading permits...' : `${permits.length} permits`}</strong>
        <span>Plant 01 / Area 01</span>
      </section>

      {error && <p className="message error" role="alert">{error}</p>}

      {!loading && !error && permits.length === 0 && (
        <section className="empty-state" aria-label="No active permits">
          <div className="empty-icon">PTW</div>
          <div>
            <p className="eyebrow">Clear work area</p>
            <h2>No active permits</h2>
            <p className="muted">Approved and active permits will appear here when work is scheduled for this area.</p>
          </div>
          <button type="button" onClick={() => void refreshPermits()}>Refresh register</button>
        </section>
      )}

      <section className="permit-list" aria-label="Permits">
        {permits.map((permit) => (
          <article className="permit-row" key={permit.permitNumber}>
            <div>
              <strong>{permit.permitNumber}</strong>
              <h2>{permit.title}</h2>
            </div>
            <span className={`status status-${permit.status.toLowerCase()}`}>{permit.status}</span>
            <time>{new Date(permit.plannedStart).toLocaleString()}</time>
          </article>
        ))}
      </section>

      {showRegistration && (
        <div className="modal-backdrop" role="presentation">
          <section className="registration-modal" role="dialog" aria-modal="true" aria-labelledby="registration-title">
            {registrationSent ? (
              <>
                <p className="eyebrow">Request received</p>
                <h2 id="registration-title">Access request submitted</h2>
                <p className="muted">This local demo does not send a request to an administrator or grant enterprise access.</p>
                <button type="button" onClick={() => {
                  setShowRegistration(false);
                  openRegister();
                  setShowPermitForm(true);
                }}>
                  Continue to demo permit form
                </button>
                <button className="text-button" type="button" onClick={() => setShowRegistration(false)}>Close</button>
              </>
            ) : (
              <>
                <div className="modal-heading">
                  <div>
                    <p className="eyebrow">Enterprise access</p>
                    <h2 id="registration-title">Register for PTW</h2>
                  </div>
                  <button className="close-button" type="button" aria-label="Close registration" onClick={() => setShowRegistration(false)}>×</button>
                </div>
                <p className="muted">Request access using your work identity. Local passwords are not stored in PTW.</p>
                <p className="demo-notice" role="note">Demo only: registration is not saved and does not grant real access.</p>
                <form onSubmit={submitRegistration}>
                  <label>Full name<input name="name" required /></label>
                  <label>Work email<input name="email" type="email" required /></label>
                  <label>Requested role
                    <select name="role" defaultValue="Permit Requester">
                      <option>Permit Requester</option>
                      <option>Permit Issuer</option>
                      <option>Safety Officer</option>
                      <option>Read-Only/Auditor</option>
                    </select>
                  </label>
                  <button type="submit">Submit access request</button>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}