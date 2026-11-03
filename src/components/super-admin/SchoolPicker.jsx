import { useState } from 'react';
import { useAdminList } from '../../lib/use-admin-list';
import { useAdminResource } from '../../lib/use-admin-resource';
import { queryString } from '../../lib/system-admin-api';
import { Modal, Pagination, ResourceState, Badge } from './AdminUI';

function SchoolChoices({ onChoose, onClose }) {
  const list = useAdminList({ status: 'all' });
  const resource = useAdminResource('/schools/management' + queryString({ ...list.filters, search: undefined, page: list.page, limit: list.limit }));
  const rows = (resource.data?.schools || []).filter(s => `${s.schoolName} ${s.schoolId}`.toLowerCase().includes(list.filters.search.toLowerCase()));
  return <Modal title="Choose school" onClose={onClose}><label>Filter schools on this page<input type="search" value={list.search} onChange={e => list.setSearch(e.target.value)} maxLength={100} autoFocus /></label>
    <ResourceState resource={resource} />
    {resource.data && <><ul className="admin-school-choices">{rows.map(s => <li key={s.schoolId}><button type="button" className="secondary" onClick={() => onChoose(s)}><span><strong>{s.schoolName}</strong><small>{s.schoolId}</small></span><Badge status={s.status} /></button></li>)}</ul>{!rows.length && <p>No schools found on this page.</p>}<Pagination pagination={resource.data.pagination} {...list} /></>}
  </Modal>;
}
export default function SchoolPicker({ value, onChange, disabled = false }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  return <div className="admin-stack"><div className="admin-row"><label className="admin-school-code">School code<input readOnly aria-readonly="true" value={value || ''} placeholder="Choose a school" /></label><button type="button" className="secondary" disabled={disabled} onClick={() => setOpen(true)}>{value ? 'Change school' : 'Choose school'}</button>{name && <span>{name}</span>}</div>
    {open && <SchoolChoices onClose={() => setOpen(false)} onChoose={school => { setName(school.schoolName); onChange(school.schoolId); setOpen(false); }} />}
  </div>;
}
