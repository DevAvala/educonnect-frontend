import { useEffect, useState } from 'react';
import '../../styles/admin.css';
import { useAdmin } from '../../lib/admin-session';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, School, Users, FileUp, ScrollText, Menu, X, ArrowLeft, ShieldCheck, Layers } from 'lucide-react';

const links = [
  { to: '/super-admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/super-admin/schools', label: 'Schools', icon: School },
  { to: '/super-admin/operations', label: 'School operations', icon: Layers },
  { to: '/super-admin/admins', label: 'School admins', icon: ShieldCheck },
  { to: '/super-admin/users', label: 'Users', icon: Users },
  { to: '/super-admin/imports', label: 'Imports', icon: FileUp },
  { to: '/super-admin/audit-logs', label: 'Audit Logs', icon: ScrollText },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const operationsPage = pathname === '/super-admin/operations' || /^\/super-admin\/schools\/[^/]+\/operations(?:\/|$)/.test(pathname);
  const { user, logout } = useAdmin();
  const [loggingOut, setLoggingOut] = useState(false);
  const [desktop, setDesktop] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => setDesktop(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open || desktop) return;
    const escape = event => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', escape);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', escape); };
  }, [open, desktop]);
  return (
    <div className="admin-shell min-h-screen bg-[#F5F7FF] text-slate-900">
      {open && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden" onClick={() => setOpen(false)} />}
      <aside inert={!open && !desktop} className={`fixed inset-y-0 left-0 z-40 flex w-64 max-w-[85vw] flex-col overflow-y-auto overscroll-contain bg-[#104889] text-white transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-[#104889]/10 bg-white px-4 py-2">
          <img src="/brand/educonnect-logo.png" alt="EduConnect" className="block h-auto w-[116px] max-h-12 object-contain object-left" />
          <button className="shrink-0 rounded-lg p-1 text-[#104889] lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)}><X size={22} /></button>
        </div>
        <nav aria-label="Super admin navigation" className="flex-1 space-y-1 px-3 py-5">

          {links.map(({ to, label, icon: Icon, end }) => {
            const isActive = to === '/super-admin/operations' ? operationsPage : to === '/super-admin/schools' && operationsPage ? false : pathname === to || !end && pathname.startsWith(to + '/');
            return <Link key={to} to={to} aria-current={isActive ? 'page' : undefined} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${isActive ? 'bg-[#FEC11B] text-[#104889]' : 'text-blue-50 hover:bg-white/10'}`}>
              <Icon size={19} />{label}
            </Link>;
          })}
        </nav>
        <div className="shrink-0 border-t border-white/15 px-3 py-4">
          <a href="/" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-blue-50 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <ArrowLeft size={19} aria-hidden="true" /> Back to Home
          </a>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" aria-label="Open navigation" onClick={() => setOpen(true)}><Menu /></button>
            <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">System Administration</p><p className="hidden text-xs text-slate-500 sm:block">EduConnect control center</p></div>
          </div>
          <div className="flex shrink-0 items-center gap-3"><button disabled={loggingOut} onClick={async () => { setLoggingOut(true); await logout(); }} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">{loggingOut ? "Signing out…" : "Sign out"}</button><span aria-label={user.email || "Super Admin profile"} className="hidden h-9 w-9 items-center sm:flex justify-center rounded-full bg-[#104889] text-xs font-bold text-white">SA</span></div>
        </header>
        <main className="admin-ui mx-auto max-w-7xl px-5 py-8 sm:px-8"><Outlet /></main>
      </div>
    </div>
  );
}
