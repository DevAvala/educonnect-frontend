import { useEffect, useRef, useState } from 'react';
import { useAdmin } from '../../lib/admin-session';
export function PageHeading({ title, description, children }) {
  return <div className="admin-heading"><div><h1>{title}</h1>{description && <p>{description}</p>}</div><div className="admin-row">{children}</div></div>;
}
export function ErrorMessage({ error }) {
  if (!error) return null;
  return <div className="admin-error" role="alert"><p>{error.message}</p>{error.code && <p className="text-xs">{error.code}</p>}{error.errors?.length > 0 && <ul>{error.errors.map((e, i) => <li key={i}>{e.field}: {e.message}</li>)}</ul>}</div>;
}
export function ResourceState({ resource }) {
  return resource.loading ? <p role="status" className="admin-notice">Loading…</p> : resource.error ? <div className="admin-stack"><ErrorMessage error={resource.error} /><button className="secondary" onClick={resource.reload}>Try again</button></div> : null;
}
export function Badge({ status }) { return <span className="admin-pill" data-status={status}>{status?.replaceAll('_', ' ') || 'Unavailable'}</span>; }
export function Pagination({ pagination, page, setPage, limit, setLimit, busy = false }) {
  if (!pagination) return null;
  const pages = Math.max(1, pagination.pages);
  const start = pagination.total ? (page - 1) * (limit || pagination.limit || 20) + 1 : 0;
  const end = Math.min(page * (limit || pagination.limit || 20), pagination.total);
  const numbers = [...new Set([1, ...Array.from({ length: 5 }, (_, i) => page - 2 + i).filter(n => n > 1 && n < pages), pages])];
  return <nav className="admin-pagination" aria-label="Pagination"><span className="admin-muted" aria-live="polite">{start}–{end} of {pagination.total} · Page {page} of {pages}</span>
    {setLimit && <label className="admin-page-size">Rows per page<select aria-label="Rows per page" value={limit} disabled={busy} onChange={e => setLimit(Number(e.target.value))}>{[10,20,50].map(n => <option key={n} value={n}>{n}</option>)}</select></label>}
    <div className="admin-page-buttons"><button type="button" className="secondary" aria-label="Previous page" disabled={busy || page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
    {numbers.map((n, i) => <span key={n}>{i > 0 && n - numbers[i - 1] > 1 && <span className="admin-page-gap" aria-hidden="true">…</span>}<button type="button" className="secondary admin-page-number" aria-label={`Page ${n}`} aria-current={n === page ? 'page' : undefined} disabled={busy || n === page} onClick={() => setPage(n)}>{n}</button></span>)}
    <button type="button" className="secondary" aria-label="Next page" disabled={busy || page >= pages} onClick={() => setPage(page + 1)}>Next</button></div></nav>;
}
export function Modal({ title, busy, onClose, children, onSubmit }) {
  const dialog = useRef(null);
  useEffect(() => { const node = dialog.current; node.showModal(); return () => node.close(); }, []);
  return <dialog ref={dialog} className="admin-ui admin-modal" aria-labelledby="admin-modal-title" onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}><form onSubmit={onSubmit}>
    <h2 id="admin-modal-title">{title}</h2>{children}
    <div className="admin-row"><button type="button" className="secondary" onClick={onClose} disabled={busy}>Close</button></div>
  </form></dialog>;
}
export function ActionDialog({ action, onClose, onDone }) {
  const { api } = useAdmin();
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState(null);
  const expected = action.schoolName || (action.erase ? 'REMOVE' : '');
  const confirmed = !expected || confirmation.trim().toLowerCase() === expected.trim().toLowerCase();
  async function submit(event) {
    event.preventDefault();
    if (busy || !confirmed || reason.trim().length < 10) return;
    setBusy(true); setError(null);
    try {
      await api.request(action.path, { method: action.method, body: { ...action.body, reason: reason.trim(), ...(action.schoolName ? { confirmSchoolName: confirmation } : {}) } });
      onDone(); onClose();
    } catch (error) { setError(error); setBusy(false); }
  }
  return <Modal title={action.title} busy={busy} onClose={onClose} onSubmit={submit}>
    <p>{action.description}</p><ErrorMessage error={error} />
    <label>Reason (10–500 characters)<textarea required minLength={10} maxLength={500} value={reason} onChange={e => setReason(e.target.value)} disabled={busy} /></label>
    {expected && <label>Type {expected} to confirm<input required value={confirmation} onChange={e => setConfirmation(e.target.value)} autoComplete="off" disabled={busy} /></label>}
    <button className={action.danger ? 'danger' : ''} disabled={busy || !confirmed || reason.trim().length < 10}>{busy ? 'Saving…' : action.title}</button>
  </Modal>;
}
