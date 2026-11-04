import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import { NotFoundPage } from './pages/NotFoundPage';
import PageMetadata from './components/PageMetadata';
const Home = lazy(() => import("./pages/Home.jsx").then(m => ({ default: m.Home })));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const PricingPage = lazy(() => import("./pages/PricingPage.jsx").then(m => ({ default: m.PricingPage })));
const AdminLayout = lazy(() => import('./components/super-admin/AdminLayout.jsx'));
const AdminDashboard = lazy(() => import('./pages/super-admin/Dashboard.jsx'));
const AdminSession = lazy(() => import('./components/super-admin/AdminSession.jsx'));
const Schools = lazy(() => import('./pages/super-admin/Schools.jsx'));
const SchoolDetail = lazy(() => import('./pages/super-admin/SchoolDetail.jsx'));
const Users = lazy(() => import('./pages/super-admin/Users.jsx'));
const Imports = lazy(() => import('./pages/super-admin/Imports.jsx'));
const AuditLogs = lazy(() => import('./pages/super-admin/AuditLogs.jsx'));
const SchoolOperations = lazy(() => import('./pages/super-admin/SchoolOperations.jsx'));
const LegalDocuments = lazy(() => import("./pages/LegalDocuments.jsx"));



function App() {


  return (
    <div className={`font-[Inter]`}>
      <PageMetadata />
      <Suspense fallback={<div className="p-8 text-center text-slate-600">Loading page…</div>}><Routes>
        <Route path="/" element={<Home />} />
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
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/legal-documents/:docId?" element={<LegalDocuments />} />

          <Route path="*" element={<NotFoundPage />} />
      </Routes></Suspense>

    </div>
  )
}

export default App
