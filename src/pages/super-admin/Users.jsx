import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminList } from '../../lib/use-admin-list';
import AdminEmailDialog from '../../components/super-admin/AdminEmailDialog';
import { useAdminResource } from '../../lib/use-admin-resource';
import { queryString } from '../../lib/system-admin-api';
import { ActionDialog, Badge, PageHeading, Pagination, ResourceState } from '../../components/super-admin/AdminUI';
export default function Users({ adminsOnly = false }) {
  const list = useAdminList({ role: adminsOnly ? 'admin' : '' });
  const [messaging, setMessaging] = useState(null);
  const [action, setAction] = useState(null);
  const [notice, setNotice] = useState('');
  const resource = useAdminResource('/users/management' + queryString({ ...list.filters, page: list.page, limit: list.limit }));
  return <div className="admin-stack"><PageHeading title={adminsOnly ? 'School admins' : 'Users'} description={adminsOnly ? 'Manage school administrators and contact them directly.' : 'Accounts across the platform.'} />
    <div className="admin-toolbar"><label>Search {adminsOnly ? 'admins' : 'users'}<input type="search" value={list.search} onChange={e => list.setSearch(e.target.value)} maxLength={100} /></label>
    {!adminsOnly && <label>Role<select value={list.filters.role} onChange={e => list.filter('role', e.target.value)}><option value="">All roles</option>{['admin','teacher','parent','student'].map(role => <option key={role}>{role}</option>)}</select></label>}
    <button type="button" className="secondary" onClick={resource.reload}>Refresh</button></div>
    {notice && <p className="admin-success" role="status">{notice}</p>}<ResourceState resource={resource} />{resource.data && <div className="admin-card"><div className="admin-table-wrap"><table><thead><tr><th>Name</th><th>School</th><th>Role</th><th>Status</th><th>Access</th></tr></thead><tbody>{resource.data.users?.map(u => <tr key={u.id}><td>{u.fullName}<p className="admin-muted">{u.email}</p></td><td>{u.school ? <Link to={`/super-admin/schools/${encodeURIComponent(u.school.schoolId)}`}>{u.school.schoolName}</Link> : 'Unassigned'}</td><td>{u.role}</td><td><Badge status={u.isActive ? 'active' : 'inactive'} /></td><td><div className="admin-row">{u.role === 'admin' && <><button className="secondary" onClick={() => setMessaging(u)}>Compose email</button></>}<button className="secondary" onClick={() => setAction({ title: u.isActive ? 'Deactivate user' : 'Activate user', path: `/users/${encodeURIComponent(u.id)}/access`, method: 'PUT', body: { action: u.isActive ? 'deactivate' : 'activate' }, danger: u.isActive, description: `Change account access for ${u.fullName}. Deactivation closes their sessions and blocks login.` })}>{u.isActive ? 'Deactivate' : 'Activate'}</button>{u.school && <button className="secondary" onClick={() => setAction({ title: 'Remove user', path: `/schools/${encodeURIComponent(u.school.schoolId)}/users/${encodeURIComponent(u.id)}`, method: 'DELETE', danger: true, erase: true, description: `This erases personal details for ${u.fullName} and closes their login and any linked student profile. Academic and fee records remain. A school's primary admin cannot be removed.` })}>Remove</button>}</div></td></tr>)}</tbody></table></div>{!resource.data.users?.length && <p className="admin-notice">No users match these filters.</p>}<Pagination pagination={resource.data.pagination} {...list} /></div>}
    {messaging && <AdminEmailDialog admin={messaging} onClose={() => setMessaging(null)} />}
    {action && <ActionDialog action={action} onClose={() => setAction(null)} onDone={() => { setNotice('Account access updated.'); resource.reload(); }} />}
  </div>;
}
