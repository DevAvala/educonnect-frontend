import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';



const AdminLayout = lazy(() => import('./components/super-admin/AdminLayout.jsx'));
const AdminDashboard = lazy(() => import('./pages/super-admin/Dashboard.jsx'));
const AdminSession = lazy(() => import('./components/super-admin/AdminSession.jsx'));
const Schools = lazy(() => import('./pages/super-admin/Schools.jsx'));
const SchoolDetail = lazy(() => import('./pages/super-admin/SchoolDetail.jsx'));
const Users = lazy(() => import('./pages/super-admin/Users.jsx'));
const Imports = lazy(() => import('./pages/super-admin/Imports.jsx'));
const AuditLogs = lazy(() => import('./pages/super-admin/AuditLogs.jsx'));
const SchoolOperations = lazy(() => import('./pages/super-admin/SchoolOperations.jsx'));



function App() {


  return (
    <div className={`font-[Inter]`}>

      <Suspense fallback={<div className="p-8 text-center text-slate-600">Loading page…</div>}><Routes>
        <Route path="/" element={<Navigate to="/super-admin" replace />} />
        <Route element={<AdminSession />}>
        <Route path="/super-admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="schools" element={<Schools />} />
          <Route path="schools/:schoolId" element={<SchoolDetail />} />
          <Route path="operations" element={<SchoolOperations />} />
          <Route path="schools/:schoolId/operations/:section?" element={<SchoolOperations />} />
          <Route path="users" element={<Users />} />
          <Route path="admins" element={<Users key="admins" adminsOnly />} />
          <Route path="imports" element={<Imports />} />
          <Route path="audit-logs" element={<AuditLogs />} />
        </Route>
        </Route>
        <Route path="*" element={<main><h1>Page Not Found</h1><Link to="/super-admin">Go to Super Admin</Link></main>} />
      </Routes></Suspense>

    </div>
  )
}

export default App
