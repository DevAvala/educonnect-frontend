import { createContext, useContext } from 'react';
import { createSystemAdminApi } from './system-admin-api';
import { resolveAdminOrigin } from './admin-config';
let api = null;
try {
  api = createSystemAdminApi(resolveAdminOrigin(import.meta.env.VITE_API_BASE_URL, import.meta.env.DEV));
} catch { /* An unconfigured admin area must not break the public website. */ }
export const adminApi = api;
export const AdminSession = createContext(null);
export function useAdmin() {
  const session = useContext(AdminSession);
  if (!session) throw new Error('Admin session is unavailable');
  return session;
}
