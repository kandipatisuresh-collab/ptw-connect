import { useState } from 'react';
import { PermitForm } from './PermitForm.js';
export function PermitCreatePage({ onCreated }: { onCreated?: (permit: unknown) => void }) { const [created, setCreated] = useState(false); return <section><h2>Create permit</h2><PermitForm onCreated={(permit) => { setCreated(true); onCreated?.(permit); }} />{created && <p role="status">Draft saved.</p>}</section>; }
