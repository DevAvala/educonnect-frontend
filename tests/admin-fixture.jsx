/* Test-only browser harness. Never imported by the production application. */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import '../src/index.css';
const params = new URLSearchParams(location.search);
const school = { schoolId: 'TST1234', schoolName: 'Integration Test School', email: 'school@example.invalid', status: 'active', systemConfig: { subscriptionTier: 'basic' }, statistics: { totalStudents: 5 } };
const schools = [school, ...Array.from({ length: 42 }, (_, i) => ({ ...school, schoolId: `FIX${1001+i}`, schoolName: `Review School ${String(i+1).padStart(2,'0')}`, status: i < 27 ? 'active' : i < 35 ? 'inactive' : i < 39 ? 'archived' : 'deleted' }))];
const user = { role: 'system_admin', email: 'admin@example.invalid' };
const student = { id: '00000000-0000-4000-8000-000000000001', studentId: 'TEST01', firstName: 'Test', lastName: 'Student', isActive: true, hasLogin: false };
const staff = { id: '00000000-0000-4000-8000-000000000002', firstName: 'Test', lastName: 'Teacher', email: 'teacher@example.invalid', role: 'teacher', status: 'not_invited', isActive: true };
const admin = { id: '00000000-0000-4000-8000-000000000003', fullName: 'Test Administrator', firstName: 'Test', lastName: 'Administrator', email: 'school-admin@example.invalid', role: 'admin', isActive: true, school };
const users = [admin, { ...staff, fullName: 'Test Teacher', school }, ...Array.from({ length: 34 }, (_, i) => ({ ...admin, id: `00000000-0000-4000-8000-${String(i+10).padStart(12,'0')}`, fullName: `Review Admin ${i+1}` }))];
const requests = [];
const actualFetch = window.fetch.bind(window);
let imported = false;
function paged(rows, query) {
  const page = Number(query.get('page') || 1), limit = Number(query.get('limit') || 20);
  return { rows: rows.slice((page-1)*limit,page*limit), pagination:{page,limit,total:rows.length,pages:Math.ceil(rows.length/limit)} };
}
window.fetch = async (input, options = {}) => {
  if (!String(input).includes('/api/system-admin')) return actualFetch(input, options);
  const path = String(input).split('/api/system-admin')[1];
  const url = new URL('https://fixture.invalid'+path), query = url.searchParams, pathname = url.pathname;
  requests.push(`${options.method || 'GET'} ${path}`);
  document.getElementById('qa-requests').textContent = requests.join('\n');
  const body = typeof options.body === 'string' ? JSON.parse(options.body) : {};
  const search = (query.get('search') || '').toLowerCase();
  const matching = rows => rows.filter(r => Object.values(r).some(v=>typeof v==='string'&&v.toLowerCase().includes(search)));
  let data;
  if (pathname === '/auth/refresh' || pathname === '/auth/login') data = { token: 'fixture-only', user };
  else if (pathname === '/platform/overview') data = { kpis: { schools: { total: 28 }, users: { total: 36 }, students: { total: 5 }, activity: { dailyActiveOperations: 9 } }, generatedAt: '2026-11-03T09:00:00Z' };
  else if (pathname === '/schools' && options.method === 'POST') data = { school, temporaryPassword: 'FIXTURE-ONLY-not-a-real-password' };
  else if (pathname === '/schools/management') { const filtered=matching(schools).filter(s=>!query.get('status')||query.get('status')==='all'||s.status===query.get('status'));const p=paged(filtered,query);data={schools:p.rows,pagination:p.pagination}; }
  else if (pathname === '/audit-logs') {const logs=[{ id:'test-log',action:'school.create',entityId:school.schoolId,userId:user.email,createdAt:'2026-11-03T09:00:00Z'}];data={logs,pagination:paged(logs,query).pagination};}
  else if (pathname === '/users/management') {const p=paged(matching(users).filter(u=>!query.get('role')||u.role===query.get('role')),query);data={users:p.rows,pagination:p.pagination};}
  else if (/^\/schools\/[A-Z]{3}\d{4}\/config$/.test(pathname) && options.method === 'PUT') { school.systemConfig.subscriptionTier=body.subscriptionTier;school.systemConfig.subscriptionStatus=body.subscriptionStatus;data={school:{...school,subscriptionTier:body.subscriptionTier,subscriptionStatus:body.subscriptionStatus}}; }
  else if (pathname.includes('/import/')) {const dryRun=query.get('dryRun')==='true';imported=!dryRun;data={dryRun,summary:{totalRows:1,valid:1,invalid:0,imported:dryRun?0:1},errors:[],warnings:[],ignoredColumns:[]};}
  else if (pathname.endsWith('/staff/invite')) data={invited:1,failed:0,remainingNotInvited:0,results:[{userId:staff.id,email:staff.email,status:'invited',emailSent:true}]};
  else if (pathname.endsWith('/students')) {const p=paged(imported?[student,{...student,id:'second',firstName:'Imported'}]:[student],query);data={students:p.rows,pagination:p.pagination};}
  else if (pathname.endsWith('/staff')) {const p=paged(matching([staff,admin]).filter(p=>!query.get('role')||p.role===query.get('role')),query);data={staff:p.rows,pagination:p.pagination};}
  else if (/^\/schools\/[A-Z]{3}\d{4}$/.test(pathname)) {const selected=schools.find(s=>pathname.endsWith(s.schoolId))||school;data={school:{...selected,subscription:{tier:selected.systemConfig.subscriptionTier,status:selected.systemConfig.subscriptionStatus||'trial'}},admin,statistics:{students:5,teachers:1,admins:1,activeClasses:4,pendingInvitations:0}};}
  else if (['PUT','DELETE','POST'].includes(options.method) && /^\/(users\/[^/]+\/access|schools\/[A-Z]{3}\d{4}(\/(deactivate|reactivate|archive|restore|users\/[^/]+|students\/[^/]+))?)$/.test(pathname)) data={updated:true};
  else return new Response(JSON.stringify({success:false,message:'Endpoint unavailable in the existing backend contract.'}),{status:404});
  return new Response(JSON.stringify({success:true,data}),{status:200,headers:{'Content-Type':'application/json'}});
};
const { default: App } = await import('../src/App.jsx');
createRoot(document.getElementById('root')).render(<MemoryRouter initialEntries={[params.get('route') || '/super-admin']}><App /></MemoryRouter>);
