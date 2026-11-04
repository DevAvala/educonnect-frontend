import { dateTime } from '../../lib/admin-format';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAdminResource } from '../../lib/use-admin-resource';
import { queryString } from '../../lib/system-admin-api';
import { PageHeading, Pagination, ResourceState } from '../../components/super-admin/AdminUI';
export default function AuditLogs() {
  const [params] = useSearchParams();
  const [filters, setFilters] = useState({ schoolId: params.get('schoolId') || '' });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const resource = useAdminResource('/audit-logs' + queryString({ ...filters, page, limit }));
  function submit(event) { event.preventDefault(); setFilters(Object.fromEntries(new FormData(event.currentTarget))); setPage(1); }
  return <div className="admin-stack"><PageHeading title="Audit logs" description="Recorded platform operations, newest first." /><form onSubmit={submit} className="admin-toolbar"><label>School code<input name="schoolId" defaultValue={filters.schoolId} pattern="[A-Z]{3}[0-9]{4}" placeholder="ABC1234" maxLength={7} /></label><label>Action<input name="action" placeholder="school.archive" maxLength={60} /></label><label>Actor<input name="actor" maxLength={254} placeholder="Admin email" /></label><button>Apply filters</button></form><button className="secondary" onClick={resource.reload}>Refresh</button>
    <ResourceState resource={resource} />{resource.data && <div className="admin-card"><div className="admin-table-wrap"><table><thead><tr><th>Time</th><th>Action</th><th>Entity</th><th>Actor</th><th>Details</th></tr></thead><tbody>{resource.data.logs?.map(log => <tr key={log.id}><td>{dateTime(log.createdAt)}</td><td>{log.action}</td><td>{log.details?.schoolCode || log.entityId}</td><td>{log.userId || 'System'}</td><td><details><summary>View details</summary><pre>{JSON.stringify(log.details, null, 2)}</pre></details></td></tr>)}</tbody></table></div>{!resource.data.logs?.length && <p className="admin-notice">No audit entries match these filters.</p>}<Pagination pagination={resource.data.pagination} page={page} setPage={setPage} limit={limit} setLimit={value => { setLimit(value); setPage(1); }} /></div>}
  </div>;
}
