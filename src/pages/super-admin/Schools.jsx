import { display } from '../../lib/admin-format';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminList } from '../../lib/use-admin-list';
import { useAdmin } from '../../lib/admin-session';
import { queryString } from '../../lib/system-admin-api';
import { useAdminResource } from '../../lib/use-admin-resource';
import { Badge, Modal, ErrorMessage, PageHeading, Pagination, ResourceState } from '../../components/super-admin/AdminUI';
function CreateSchool({ onClose, onCreated }) {
  const { api } = useAdmin();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [created, setCreated] = useState(null);
  async function submit(event) {
    event.preventDefault();
    if (busy || created) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const { firstName, lastName, ...fields } = values;
    const body = Object.fromEntries(Object.entries(fields).filter(([, v]) => v.trim()).map(([k, v]) => [k, v.trim()]));
    if (firstName || lastName) body.adminUserData = Object.fromEntries(Object.entries({ firstName, lastName }).filter(([, v]) => v.trim()).map(([k, v]) => [k, v.trim()]));
    setBusy(true); setError(null);
    try { setCreated(await api.request('/schools', { method: 'POST', body })); onCreated(); }
    catch (error) { setError(error); }
    finally { setBusy(false); }
  }
  return <Modal title={created ? 'School created' : 'Add school'} busy={busy} onClose={onClose} onSubmit={submit}>
    {created ? <><p className="admin-success">{created.school?.schoolName} · {created.school?.schoolId}</p>{created.temporaryPassword && <div className="admin-stack"><p>Save this temporary password now. It will not be shown again after closing this window.</p><label>Temporary admin password<input readOnly value={created.temporaryPassword} /></label></div>}</> : <><ErrorMessage error={error} /><div className="admin-form-grid">
      <label>School name *<input name="schoolName" required minLength={2} maxLength={100} disabled={busy} /></label><label>School admin email *<input name="email" type="email" required maxLength={254} disabled={busy} /></label>
      <label>Phone<input name="phone" type="tel" maxLength={20} disabled={busy} /></label><label>Principal name<input name="principalName" maxLength={100} disabled={busy} /></label>
      <label>Admin first name<input name="firstName" maxLength={100} disabled={busy} /></label><label>Admin last name<input name="lastName" maxLength={100} disabled={busy} /></label>
      <label>Subscription tier<select name="subscriptionTier" disabled={busy}>{['basic','standard','premium','enterprise'].map(t => <option key={t}>{t}</option>)}</select></label>
    </div><label>Address<textarea name="address" maxLength={500} disabled={busy} /></label><p className="admin-muted">A temporary password will be generated and shown once. The school starts on a 30-day trial.</p><button disabled={busy}>{busy ? 'Creating…' : 'Create school'}</button></>}
  </Modal>;
}
export default function Schools() {
  const list = useAdminList({ status: 'active', tier: '' });
  const [creating, setCreating] = useState(false);
  const resource = useAdminResource('/schools/management' + queryString({ ...list.filters, search: undefined, page: list.page, limit: list.limit }));
  const rows = resource.data?.schools?.filter(s => `${s.schoolName} ${s.schoolId} ${s.email}`.toLowerCase().includes(list.filters.search.toLowerCase())) || [];
  return <div className="admin-stack"><PageHeading title="Schools" description="Manage schools and their access to the platform."><button onClick={() => setCreating(true)}>Add school</button></PageHeading>
    <div className="admin-tabs" aria-label="School status">{['active','inactive','archived','deleted','all'].map(s => <button key={s} className="secondary capitalize" aria-pressed={s === list.filters.status} onClick={() => list.filter('status', s)}>{s}</button>)}</div>
    <div className="admin-toolbar"><label>Filter this page<input type="search" maxLength={100} value={list.search} onChange={e => list.setSearch(e.target.value)} placeholder="Name, email or school code" /></label><label>Subscription<select value={list.filters.tier} onChange={e => list.filter('tier', e.target.value)}><option value="">All tiers</option>{['basic','standard','premium','enterprise'].map(t => <option key={t}>{t}</option>)}</select></label><button className="secondary" onClick={resource.reload}>Refresh</button></div>
    <ResourceState resource={resource} />{resource.data && <section className="admin-card"><div className="admin-table-wrap"><table><thead><tr><th>School</th><th>Code</th><th>Tier</th><th>Status</th><th>Students</th><th>Operations</th></tr></thead><tbody>{rows.map(s => <tr key={s.schoolId}><td><Link to={encodeURIComponent(s.schoolId)}>{s.schoolName}</Link><p className="admin-muted">{s.email}</p></td><td><code>{s.schoolId}</code></td><td>{display(s.systemConfig?.subscriptionTier)}</td><td><Badge status={s.status} /></td><td>{display(s.statistics?.totalStudents)}</td><td><Link to={`${encodeURIComponent(s.schoolId)}/operations`}>Manage operations</Link></td></tr>)}</tbody></table></div>{!rows.length && <p className="admin-notice">No schools match these filters.</p>}<Pagination pagination={resource.data.pagination} {...list} /></section>}
    {creating && <CreateSchool onClose={() => setCreating(false)} onCreated={resource.reload} />}
  </div>;
}
