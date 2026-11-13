import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import { NotFoundPage } from './pages/NotFoundPage';
import PageMetadata from './components/PageMetadata';
const Home = lazy(() => import("./pages/Home.jsx").then(m => ({ default: m.Home })));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const PricingPage = lazy(() => import("./pages/PricingPage.jsx").then(m => ({ default: m.PricingPage })));
const LegalDocuments = lazy(() => import("./pages/LegalDocuments.jsx"));



function App() {


  return (
    <div className={`font-[Inter]`}>
      <PageMetadata />
      <Suspense fallback={<div className="p-8 text-center text-slate-600">Loading page…</div>}><Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/legal-documents/:docId?" element={<LegalDocuments />} />

          <Route path="*" element={<NotFoundPage />} />
      </Routes></Suspense>

    </div>
  )
}

export default App
