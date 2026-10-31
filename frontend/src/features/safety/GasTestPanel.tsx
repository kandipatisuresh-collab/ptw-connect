import { useState } from 'react';
export function GasTestPanel() { const [lel, setLel] = useState(0); return <section><h2>Gas test</h2><label>LEL %<input type="number" min="0" value={lel} onChange={(event) => setLel(Number(event.target.value))} /></label>{lel > 10 && <p role="alert">LEL exceeds configured limit.</p>}</section>; }
