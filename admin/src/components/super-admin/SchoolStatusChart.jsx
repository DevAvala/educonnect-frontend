import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../lib/admin-session';
import { loadSchoolDistribution } from '../../lib/admin-chart';
import { ErrorMessage } from './AdminUI';
const statuses = [['active', 'Active', '#10b981'], ['inactive', 'Inactive', '#f5b914'], ['archived', 'Archived', '#94a3b8'], ['deleted', 'Deleted', '#c9676d']];
export default function SchoolStatusChart() {
  const { api } = useAdmin();
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    loadSchoolDistribution(api, controller.signal).then(counts => {
      if (!controller.signal.aborted) setResult({ revision, counts });
    }).catch(error => { if (!controller.signal.aborted) setResult({ revision, error }); });
    return () => controller.abort();
  }, [api, revision]);
  const current = result?.revision === revision ? result : null;
  const total = current?.counts ? Object.values(current.counts).reduce((a, b) => a + b, 0) : 0;
  return <section className="admin-card admin-stack" aria-label="School status chart"><div className="admin-heading"><div><h2>School status</h2><p>Distribution across all schools</p></div><button className="secondary" onClick={() => setRevision(v => v + 1)} aria-label="Refresh school status">Refresh</button></div>
    {!current ? <p role="status">Loading school totals…</p> : current.error ? <ErrorMessage error={current.error} /> : total ? <>
      <div className="admin-status-bar" role="img" aria-label={statuses.map(([key, label]) => `${label}: ${current.counts[key]}`).join(', ')}>{statuses.map(([key, label, color]) => current.counts[key] > 0 && <span key={key} style={{ width: `${current.counts[key] / total * 100}%`, background: color }} title={`${label}: ${current.counts[key]}`} />)}</div>
      <ul className="admin-chart-legend">{statuses.map(([key, label, color]) => <li key={key}><span style={{ background: color }} aria-hidden="true" /><span>{label} · <strong>{current.counts[key]}</strong> · {(current.counts[key] / total * 100).toFixed(1)}%</span></li>)}</ul>
    </> : <p className="admin-muted">No schools yet. Add a school to see its status here.</p>}
    <Link to="/super-admin/schools">Manage schools</Link>
  </section>;
}
