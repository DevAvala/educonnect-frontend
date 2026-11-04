import { useState } from 'react';
import { useAdmin } from '../../lib/admin-session';
import { ErrorMessage } from './AdminUI';
export default function SchoolSubscription({ schoolId, subscription, onSaved }) {
  const { api } = useAdmin();
  const [tier, setTier] = useState(subscription?.tier || 'basic');
  const [status, setStatus] = useState(subscription?.status || 'trial');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const changed = tier !== subscription?.tier || status !== subscription?.status;
  async function submit(event) {
    event.preventDefault();
    if (busy || !changed || reason.trim().length < 10) return;
    setBusy(true); setError(null);
    try {
      await api.request(`/schools/${encodeURIComponent(schoolId)}/config`, { method: 'PUT', body: { subscriptionTier: tier, subscriptionStatus: status, systemNote: reason.trim() } });
      onSaved();
    } catch (error) { setError(error); setBusy(false); }
  }
  return <form className="admin-card admin-stack" onSubmit={submit}><h2>Subscription</h2><ErrorMessage error={error} />
    <div className="admin-form-grid"><label>School code<input readOnly value={schoolId} /></label><label>Subscription tier<select value={tier} onChange={e => setTier(e.target.value)} disabled={busy}>{['basic','standard','premium','enterprise'].map(t => <option key={t}>{t}</option>)}</select></label><label>Subscription status<select value={status} onChange={e => setStatus(e.target.value)} disabled={busy}>{['trial','active','suspended','cancelled'].map(s => <option key={s}>{s}</option>)}</select></label></div>
    <p className="admin-muted">Subscription settings are separate from school access. Use School profile to deactivate, archive or restore a school.</p>
    <label>Reason for change (10–500 characters)<textarea required minLength={10} maxLength={500} value={reason} onChange={e => setReason(e.target.value)} disabled={busy} /></label>
    <div><button disabled={busy || !changed || reason.trim().length < 10}>{busy ? 'Saving…' : 'Save subscription'}</button></div>
  </form>;
}
