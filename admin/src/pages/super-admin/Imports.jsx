import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAdmin } from '../../lib/admin-session';
import { ErrorMessage, PageHeading } from '../../components/super-admin/AdminUI';
import SchoolPicker from '../../components/super-admin/SchoolPicker';
const validCode = code => /^[A-Z]{3}\d{4}$/.test(code);
export default function Imports() {
  const { api } = useAdmin();
  const [params] = useSearchParams();
  const [schoolId, setSchoolId] = useState(params.get('schoolId') || '');
  const [kind, setKind] = useState('students');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  function reset() { setPreview(null); setResult(null); setError(null); }
  function chooseFile(event) {
    reset();
    const chosen = event.target.files?.[0];
    setFile(null);
    if (!chosen) return;
    if (!/\.csv$/i.test(chosen.name) || chosen.size > 5 * 1024 * 1024 || chosen.size === 0) {
      setError({ message: 'Choose a non-empty CSV file of 5 MB or less.' }); event.target.value = ''; return;
    }
    setFile(chosen);
  }
  async function download() {
    setDownloading(true); setError(null);
    try {
      const blob = await api.download(`/import/templates/${kind}`);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = `${kind}-template.csv`; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) { setError(error); }
    finally { setDownloading(false); }
  }
  async function run(dryRun) {
    if (busy || !file || !validCode(schoolId) || (!dryRun && (!preview || preview.summary?.invalid !== 0 || preview.summary?.valid < 1))) return;
    setBusy(true); setError(null); setResult(null);
    // A real import can never be replayed by this button without a new validation.
    if (!dryRun) setPreview(null);
    const body = new FormData(); body.append('file', file);
    try {
      const response = await api.request(`/schools/${encodeURIComponent(schoolId)}/import/${kind}${dryRun ? '?dryRun=true' : ''}`, { method: 'POST', body });
      if (dryRun) setPreview(response); else setResult(response);
    } catch (error) { setPreview(null); setError(error); }
    finally { setBusy(false); }
  }
  const report = result || preview;
  return <div className="admin-stack"><PageHeading title="Import records" description="Validate a CSV before adding students or teachers. Imports create records without logins or emails." />
    <section className="admin-card admin-stack"><div className="admin-form-grid"><SchoolPicker value={schoolId} onChange={code => { setSchoolId(code); reset(); }} disabled={busy} /><label>Records<select value={kind} onChange={e => { setKind(e.target.value); reset(); }} disabled={busy}><option value="students">Students</option><option value="staff">Teachers</option></select></label></div>
      <div><button className="secondary" onClick={download} disabled={downloading || busy}>{downloading ? 'Downloading…' : 'Download CSV template'}</button></div>
      <label>CSV file<input type="file" accept=".csv,text/csv" onChange={chooseFile} disabled={busy} /></label><p className="admin-muted">Up to 5 MB and 5,000 rows. Classes and arms must already exist. Teacher imports never create admins.</p><ErrorMessage error={error} />
      {error && !preview && <p className="admin-notice">If a real import was interrupted, check the school records before validating and importing again.</p>}
      <div className="admin-row"><button disabled={busy || !file || !validCode(schoolId)} onClick={() => run(true)}>{busy ? 'Processing…' : 'Validate CSV'}</button>{preview && <button disabled={busy || preview.summary?.invalid !== 0 || preview.summary?.valid < 1} onClick={() => run(false)}>Import {preview.summary?.valid || 0} records</button>}</div>
    </section>
    {report && <section className="admin-card admin-stack" aria-live="polite"><h2>{result ? 'Import result' : 'Validation result'}</h2><p className={result ? 'admin-success' : 'admin-notice'}>{report.summary?.totalRows} rows · {report.summary?.valid} valid · {report.summary?.invalid} invalid{result ? ` · ${report.summary?.imported} imported` : ' · No records saved'}</p>
      {!result && report.summary?.invalid > 0 && <p>Fix the reported errors, select the corrected file and validate again before importing.</p>}
      {!!report.errors?.length && <div className="admin-table-wrap"><table><thead><tr><th>Line</th><th>Column</th><th>Error</th></tr></thead><tbody>{report.errors.map((e,i) => <tr key={i}><td>{e.line}</td><td>{e.field}</td><td>{e.message}</td></tr>)}</tbody></table></div>}
      {!!report.warnings?.length && <div><h2>Warnings</h2><ul>{report.warnings.map((w,i) => <li key={i}>{typeof w === 'string' ? w : `Line ${w.line}: ${w.message}`}</li>)}</ul></div>}
      {!!report.ignoredColumns?.length && <p>Ignored columns: {report.ignoredColumns.join(', ')}</p>}
      {result && <><p>Valid rows were saved. Any invalid rows shown above were skipped.</p><Link to={`/super-admin/schools/${encodeURIComponent(schoolId)}`}>View school records{kind === 'staff' ? ' and invite teachers' : ''}</Link></>}
    </section>}
  </div>;
}
