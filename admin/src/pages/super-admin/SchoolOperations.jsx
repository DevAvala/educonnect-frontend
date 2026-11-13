import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAdminList } from '../../lib/use-admin-list';
import { useAdminResource } from '../../lib/use-admin-resource';
import { queryString } from '../../lib/system-admin-api';
import { display } from '../../lib/admin-format';
import { Badge, PageHeading, Pagination, ResourceState } from '../../components/super-admin/AdminUI';
import SchoolPicker from '../../components/super-admin/SchoolPicker';
import SchoolSubscription from '../../components/super-admin/SchoolSubscription';

function SchoolWorkspace({ schoolId, section }) {
  const navigate = useNavigate();
  const resource = useAdminResource(`/schools/${encodeURIComponent(schoolId)}`);
  const [saved, setSaved] = useState(false);
  const data = resource.data;
  const root = `/super-admin/schools/${encodeURIComponent(schoolId)}`;
  const cards = [
    { title: 'Students', description: 'Search and review student records.', to: `${root}?tab=students`, count: data?.statistics?.students },
    { title: 'Teachers & staff', description: 'Manage staff access and invite imported teachers.', to: `${root}?tab=staff`, count: data?.statistics?.teachers },
    { title: 'School admins', description: 'Review the administrators assigned to this school.', to: `${root}?tab=staff&role=admin`, count: data?.statistics?.admins },
    { title: 'Import records', description: 'Validate and import student or teacher CSV records.', to: `/super-admin/imports?schoolId=${encodeURIComponent(schoolId)}` },
    { title: 'School profile & access', description: 'Review contact details, deactivate, archive or restore a school.', to: root },
    { title: 'Subscription', description: 'Review and update the school subscription tier and status.', to: `${root}/operations/configuration` },
    { title: 'School audit trail', description: 'Review recorded platform actions for this school.', to: `/super-admin/audit-logs?schoolId=${encodeURIComponent(schoolId)}` }
  ];
  return <div className="admin-stack"><Link to="/super-admin/operations">All school operations</Link><PageHeading title={data?.school.schoolName || 'School operations'} description={`School code: ${schoolId}`}><Link to={root}>School profile</Link></PageHeading>
    <SchoolPicker value={schoolId} onChange={code => navigate(`/super-admin/schools/${encodeURIComponent(code)}/operations`)} /><ResourceState resource={resource} />
    {data && <><div className="admin-row"><Badge status={data.school.status} /><span className="admin-muted">Active classes: {display(data.statistics?.activeClasses)} · Pending invitations: {display(data.statistics?.pendingInvitations)}</span></div>
      {section === 'configuration' ? <><Link to={`${root}/operations`}>Back to school operations</Link>{saved && <p className="admin-success" role="status">Subscription saved.</p>}{data.school.status === 'active' ? <SchoolSubscription key={JSON.stringify(data.school.subscription)} schoolId={schoolId} subscription={data.school.subscription} onSaved={() => { setSaved(true); resource.reload(); }} /> : <p className="admin-notice">Restore and reactivate this school before changing its subscription.</p>}</> : <>
        {section && <p className="admin-notice">Select an available school operation below.</p>}
        <div className="admin-operation-grid">{cards.map(card => <Link className="admin-operation-card" key={card.title} to={card.to}><h2>{card.title}</h2><p>{card.description}</p>{card.count != null && <strong>{display(card.count)} {card.title === 'Teachers & staff' ? (card.count === 1 ? 'teacher' : 'teachers') : card.count === 1 ? 'record' : 'records'}</strong>}<span>Open {card.title.toLowerCase()} →</span></Link>)}</div>
      </>}
    </>}
  </div>;
}
function Directory() {
  const navigate = useNavigate();
  const list = useAdminList({ status: 'active' });
  const resource = useAdminResource('/schools/management' + queryString({ status: list.filters.status, page: list.page, limit: list.limit }));
  const rows = (resource.data?.schools || []).filter(s => `${s.schoolName} ${s.schoolId}`.toLowerCase().includes(list.filters.search.toLowerCase()));
  return <div className="admin-stack"><PageHeading title="School operations" description="Manage school people, imports, access, subscriptions and audit history." />
    <div className="admin-toolbar"><label>Filter this page<input type="search" maxLength={100} value={list.search} onChange={e => list.setSearch(e.target.value)} placeholder="School name or code" /></label><label>Status<select value={list.filters.status} onChange={e => list.filter('status', e.target.value)}>{['active','inactive','archived','deleted','all'].map(s => <option key={s}>{s}</option>)}</select></label><button className="secondary" onClick={resource.reload}>Refresh</button></div>
    <ResourceState resource={resource} />{resource.data && <section className="admin-card"><ul className="admin-school-choices">{rows.map(s => <li key={s.schoolId}><button type="button" className="secondary" onClick={() => navigate(`/super-admin/schools/${encodeURIComponent(s.schoolId)}/operations`)}><span><strong>{s.schoolName}</strong><small>{s.schoolId}</small></span><Badge status={s.status} /><span aria-hidden="true">→</span></button></li>)}</ul>{!rows.length && <p className="admin-notice">No schools match these filters.</p>}<Pagination pagination={resource.data.pagination} {...list} /></section>}
  </div>;
}
export default function SchoolOperations() {
  const { schoolId, section } = useParams();
  return schoolId ? <SchoolWorkspace key={schoolId} schoolId={schoolId} section={section} /> : <Directory />;
}
