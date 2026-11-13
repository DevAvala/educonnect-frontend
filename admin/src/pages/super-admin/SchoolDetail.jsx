import { dateTime, display } from '../../lib/admin-format';
import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useAdmin } from '../../lib/admin-session';
import { useAdminResource } from '../../lib/use-admin-resource';
import { queryString } from '../../lib/system-admin-api';
import { useAdminList } from '../../lib/use-admin-list';
import { ActionDialog, Badge, ErrorMessage, Modal, PageHeading, Pagination, ResourceState } from '../../components/super-admin/AdminUI';
function InviteDialog({ schoolId, people, onClose, onDone }) {
  const { api } = useAdmin();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  async function submit(event) {
    event.preventDefault();
    if (busy || result || !people.length) return;
    setBusy(true); setError(null);
    try { setResult(await api.request(`/schools/${encodeURIComponent(schoolId)}/staff/invite`, { method: 'POST', body: { userIds: people.map(p => p.id) } })); onDone(); }
    catch (error) { setError(error); }
    finally { setBusy(false); }
  }
  return <Modal title="Invite teachers" busy={busy} onClose={onClose} onSubmit={submit}><ErrorMessage error={error} />{result ? <><p>{result.invited} invited · {result.failed} failed · {result.remainingNotInvited} still waiting.</p><ul>{result.results?.map(r => <li key={r.userId}>{r.email}: {r.status}{r.emailSent === false ? ' (email was not sent)' : ''}{r.error ? `: ${r.error}` : ''}</li>)}</ul></> : <><p>This sends an email with a temporary password to each of these {people.length} teachers. It does not create duplicate accounts.</p><ul>{people.map(p => <li key={p.id}>{p.email}</li>)}</ul><button disabled={busy}>{busy ? 'Sending…' : 'Send invitations'}</button></>}</Modal>;
}
function People({ schoolId, tab, primaryAdminId, initialRole = '' }) {
  const list = useAdminList({ status: '', ...(tab === 'staff' ? { role: initialRole } : {}) });
  const [action, setAction] = useState(null);
  const [inviting, setInviting] = useState(null);
  const [notice, setNotice] = useState('');
  const resource = useAdminResource(`/schools/${encodeURIComponent(schoolId)}/${tab}` + queryString({ ...list.filters, page: list.page, limit: list.limit }));
  const rows = resource.data?.[tab] || [];
  const waiting = rows.filter(p => p.status === 'not_invited' && p.role === 'teacher');
  function remove(person) {
    setAction({ title: `Remove ${tab === 'staff' ? 'user' : 'student'}`, path: `/schools/${encodeURIComponent(schoolId)}/${tab === 'staff' ? 'users' : 'students'}/${encodeURIComponent(person.id)}`, method: 'DELETE', danger: true, erase: true,
      description: `This erases personal details for ${person.firstName} ${person.lastName} and closes their login and any linked profile. Academic and fee records remain. Restoring a school will not recover these personal details.` });
  }
  return <div className="admin-stack"><div className="admin-toolbar"><label>Search {tab}<input type="search" maxLength={100} value={list.search} onChange={e => list.setSearch(e.target.value)} /></label>{tab === 'staff' && <label>Role<select value={list.filters.role} onChange={e => list.filter('role', e.target.value)}><option value="">All staff</option><option value="admin">Admins</option><option value="teacher">Teachers</option></select></label>}<label>Status<select value={list.filters.status} onChange={e => list.filter('status', e.target.value)}><option value="">All statuses</option>{(tab === 'staff' ? ['not_invited','invited','active','inactive'] : ['active','inactive']).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}</select></label>{!!waiting.length && <button type="button" onClick={() => setInviting(waiting)}>Invite waiting teachers on this page ({waiting.length})</button>}</div>
    {notice && <p role="status" className="admin-success">{notice}</p>}<ResourceState resource={resource} />{resource.data && <div className="admin-card"><div className="admin-table-wrap"><table><thead><tr><th>Name</th><th>{tab === 'staff' ? 'Role' : 'Class'}</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map(p => <tr key={p.id}><td>{p.firstName} {p.lastName}<p className="admin-muted">{p.email || p.studentId}</p></td><td>{tab === 'staff' ? p.role : p.className || 'Unassigned'}</td><td><Badge status={p.status || (p.isActive ? 'active' : 'inactive')} />{tab === 'students' && <p className="admin-muted">{p.hasLogin ? 'Has login' : 'Record only'}</p>}</td><td><div className="admin-row">{p.status === 'not_invited' && p.role === 'teacher' && <button className="secondary" onClick={() => setInviting([p])}>Invite</button>}{tab === 'staff' && p.status !== 'not_invited' && p.id !== primaryAdminId && <button className="secondary" onClick={() => setAction({ title: p.isActive ? 'Deactivate user' : 'Activate user', method: 'PUT', path: `/users/${encodeURIComponent(p.id)}/access`, body: { action: p.isActive ? 'deactivate' : 'activate' }, description: `Change account access for ${p.firstName} ${p.lastName}.`, danger: p.isActive })}>{p.isActive ? 'Deactivate' : 'Activate'}</button>}<button className="secondary" disabled={p.id === primaryAdminId} onClick={() => remove(p)}>Remove</button>{p.id === primaryAdminId && <span className="admin-muted">Primary admin</span>}</div></td></tr>)}</tbody></table></div>{!rows.length && <p className="admin-notice">No {tab} found.</p>}<Pagination pagination={resource.data.pagination} {...list} /></div>}
    {action && <ActionDialog action={action} onClose={() => setAction(null)} onDone={() => { setNotice('Change saved.'); resource.reload(); }} />}{inviting && <InviteDialog schoolId={schoolId} people={inviting} onClose={() => setInviting(null)} onDone={resource.reload} />}
  </div>;
}
function SchoolView({ schoolId }) {
  const resource = useAdminResource(`/schools/${encodeURIComponent(schoolId)}`);
  const [params, setParams] = useSearchParams();
  const tab = ['students','staff'].includes(params.get('tab')) ? params.get('tab') : 'profile';
  const initialRole = ['admin','teacher'].includes(params.get('role')) ? params.get('role') : '';
  function setTab(value) { setParams(value === 'profile' ? {} : { tab: value }); }
  const [action, setAction] = useState(null);
  const [notice, setNotice] = useState('');
  const data = resource.data;
  function schoolAction(name) {
    const destructive = ['archive','delete'].includes(name);
    setAction({ title: `${name.charAt(0).toUpperCase() + name.slice(1)} school`, method: name === 'delete' ? 'DELETE' : ['deactivate','reactivate'].includes(name) ? 'PUT' : 'POST', path: `/schools/${encodeURIComponent(schoolId)}${name === 'delete' ? '' : '/' + name}`, schoolName: destructive ? data.school.schoolName : undefined, danger: ['deactivate','archive','delete'].includes(name),
      description: name === 'restore' ? 'This clears archived and deleted flags and reactivates the school.' : name === 'reactivate' ? 'This allows the school to access the platform again.' : 'Everyone in this school will lose platform access within about 30 seconds. School data is retained.' });
  }
  return <div className="admin-stack"><Link to="/super-admin/schools">Back to schools</Link><ResourceState resource={resource} />{data && <><PageHeading title={data.school.schoolName} description={schoolId}><Badge status={data.school.status} /><Link className="admin-button" to={`/super-admin/schools/${encodeURIComponent(schoolId)}/operations`}>School operations</Link><Link className="admin-button" to={`/super-admin/imports?schoolId=${encodeURIComponent(schoolId)}`}>Import records</Link></PageHeading>
    {notice && <p className="admin-success" role="status">{notice}</p>}<div className="admin-tabs" aria-label="School information">{['profile','students','staff'].map(t => <button key={t} className="secondary capitalize" aria-pressed={tab === t} onClick={() => setTab(t)}>{t}</button>)}</div>
    {tab === 'profile' ? <><div className="admin-card admin-stack"><h2>School profile</h2><dl className="admin-form-grid">{[['Email',data.school.email],['Phone',data.school.phone],['Address',data.school.address],['Subscription tier',data.school.subscription?.tier],['Subscription status',data.school.subscription?.status],['Primary admin',data.admin?.email],['Created',dateTime(data.school.createdAt)]].map(([title, value]) => <div key={title}><dt>{title}</dt><dd>{display(value)}</dd></div>)}</dl></div>
      <div className="admin-stats">{Object.entries(data.statistics || {}).map(([title, value]) => <div className="admin-card" key={title}><p className="admin-muted">{title.replace(/([A-Z])/g, ' $1')}</p><p className="admin-stat-value">{display(value)}</p></div>)}</div>
      {(data.archive || data.deletion) && <section className="admin-card"><h2>Access history</h2>{[data.archive, data.deletion].filter(Boolean).map((entry,i) => <p key={i}>{entry.reason} · {dateTime(entry.archivedAt || entry.deletedAt)}</p>)}</section>}
      <section className="admin-card admin-stack"><h2>School access</h2><p className="admin-muted">Every change requires a reason and is recorded in the audit trail.</p><div className="admin-row">{['archived','deleted'].includes(data.school.status) ? <button onClick={() => schoolAction('restore')}>Restore school</button> : <><button className="secondary" onClick={() => schoolAction(data.school.status === 'active' ? 'deactivate' : 'reactivate')}>{data.school.status === 'active' ? 'Deactivate' : 'Reactivate'}</button><button className="secondary" onClick={() => schoolAction('archive')}>Archive</button></>}{data.school.status !== 'deleted' && <button className="danger" onClick={() => schoolAction('delete')}>Delete school</button>}</div></section>
    </> : <People key={`${tab}:${initialRole}`} schoolId={schoolId} tab={tab} primaryAdminId={data.admin?.id} initialRole={initialRole} />}</>}
    {action && <ActionDialog action={action} onClose={() => setAction(null)} onDone={() => { setNotice('Change saved. Access changes may take up to 30 seconds to reach every server.'); resource.reload(); }} />}
  </div>;
}
export default function SchoolDetail() { const { schoolId } = useParams(); return <SchoolView key={schoolId} schoolId={schoolId} />; }
