import { PermitStatusBadge } from './PermitStatusBadge.js';
export function PermitDetailPage({ permit }: { permit: { permitNumber: string; title: string; workDescription: string; status: string } }) { return <article><p>{permit.permitNumber}</p><h1>{permit.title}</h1><PermitStatusBadge status={permit.status} /><p>{permit.workDescription}</p></article>; }
