import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSession, adminApi } from '../../lib/admin-session';
import Login from '../../pages/super-admin/Login';

export default function SessionBoundary() {
  const [session, setSession] = useState({ status: 'checking', user: null, message: '' });
  useEffect(() => {
    let active = true;
    const unsubscribe = adminApi.onSessionExpired(() => setSession({ status: 'signed-out', user: null, message: 'Your session has ended. Please sign in again.' }));
    adminApi.refresh().then(user => {
      if (active) setSession({ status: 'signed-in', user, message: '' });
    }).catch(error => {
      if (active) setSession({ status: 'signed-out', user: null, message: error.status === 401 ? '' : error.message });
    });
    return () => { active = false; unsubscribe(); };
  }, []);
  async function login(email, password) {
    const user = await adminApi.login(email, password);
    setSession({ status: 'signed-in', user, message: '' });
  }
  async function logout() {
    let message = '';
    try { await adminApi.logout(); }
    catch { message = 'Signed out on this page. The server could not confirm logout; close your browser if using a shared device.'; }
    setSession({ status: 'signed-out', user: null, message });
  }
  if (session.status === 'checking') return <div className="admin-session-screen" role="status">Checking your session…</div>;
  if (session.status !== 'signed-in') return <Login onLogin={login} message={session.message} />;
  return <AdminSession.Provider value={{ api: adminApi, user: session.user, logout }}><Outlet /></AdminSession.Provider>;
}
