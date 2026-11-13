import { dateTime, display } from '../../lib/admin-format';
import { Link } from 'react-router-dom';
import { useAdminResource } from '../../lib/use-admin-resource';
import SchoolStatusChart from '../../components/super-admin/SchoolStatusChart';
import { PageHeading, ResourceState } from '../../components/super-admin/AdminUI';
export default function Dashboard() {
  const overview = useAdminResource('/platform/overview');
  const audit = useAdminResource('/audit-logs?limit=5');
  const kpis = overview.data?.kpis;
  const stats = [['Active schools', kpis?.schools?.total], ['Users', kpis?.users?.total], ['Students', kpis?.students?.total], ['Operations in 24 hours', kpis?.activity?.dailyActiveOperations]];
  return <div className="admin-stack">
    <PageHeading title="Dashboard overview" description="Live platform information for active schools."><button className="secondary" onClick={() => { overview.reload(); audit.reload(); }}>Refresh</button><Link to="schools" className="admin-button">Manage schools</Link></PageHeading>
    <ResourceState resource={overview} />
    {overview.data && <><section aria-label="Platform statistics" className="admin-stats">{stats.map(([title, value]) => <div className="admin-card" key={title}><p className="admin-muted">{title}</p><p className="admin-stat-value">{display(value)}</p></div>)}</section><p className="admin-muted">Updated {dateTime(overview.data.generatedAt)}{overview.data.cached ? ' · Cached by the backend' : ''}</p></>}
    <SchoolStatusChart />
    <section className="admin-card admin-stack"><h2>Recent activity</h2><ResourceState resource={audit} />{audit.data && (audit.data.logs?.length ? <ul className="admin-stack">{audit.data.logs.map(log => <li key={log.id}><strong>{log.action}</strong><p>{log.details?.schoolName || log.entityId || 'Platform'}</p><p className="admin-muted">{log.userId || 'System'} · {dateTime(log.createdAt)}</p></li>)}</ul> : <p className="admin-muted">No activity recorded.</p>)}<Link to="audit-logs">View audit trail</Link></section>
  </div>;
}
