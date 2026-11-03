import { createContext, useContext } from 'react';
import { createSystemAdminApi } from './system-admin-api';
export const adminApi = createSystemAdminApi(import.meta.env.VITE_API_BASE_URL || 'https://educonnect-backend-staging.onrender.com');
export const AdminSession = createContext(null);
export function useAdmin() {
  const session = useContext(AdminSession);
  if (!session) throw new Error('Admin session is unavailable');
  return session;
}
