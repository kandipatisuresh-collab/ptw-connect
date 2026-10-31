import { useState } from 'react';
import type { FormEvent } from 'react';
import { createPermit, PermitDraft } from './permit-client.js';

type PermitFormValues = Omit<PermitDraft, 'plannedStart' | 'plannedEnd'> & {
  plannedStart: string;
  plannedEnd: string;
};

const initialDraft: PermitFormValues = {
  permitTypeId: 'general-maintenance',
  title: '',
  workDescription: '',
  plantId: 'plant-1',
  areaId: 'area-1',
  plannedStart: '',
  plannedEnd: '',
};

export function PermitForm({ onCreated }: { onCreated: (permit: unknown) => void }) {
  const [draft, setDraft] = useState<PermitFormValues>(initialDraft);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    try {
      const permit = await createPermit({
        ...draft,
        plannedStart: new Date(draft.plannedStart).toISOString(),
        plannedEnd: new Date(draft.plannedEnd).toISOString(),
      }, {
        'x-ptw-user': 'demo-user',
        'x-ptw-role': 'Permit Requester',
        'x-ptw-plant': draft.plantId,
        'x-ptw-area': draft.areaId,
      });
      onCreated(permit);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Permit could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <label>
        Title
        <input required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
      </label>
      <label>
        Work description
        <textarea required value={draft.workDescription} onChange={(event) => setDraft({ ...draft, workDescription: event.target.value })} />
      </label>
      <label>
        Planned start
        <input required type="datetime-local" value={draft.plannedStart} onChange={(event) => setDraft({ ...draft, plannedStart: event.target.value })} />
      </label>
      <label>
        Planned end
        <input required type="datetime-local" value={draft.plannedEnd} onChange={(event) => setDraft({ ...draft, plannedEnd: event.target.value })} />
      </label>
      {error && <p className="message error" role="alert">{error}</p>}
      <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save draft'}</button>
    </form>
  );
}