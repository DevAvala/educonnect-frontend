export function resolveAdminOrigin(value, development = false) {
  const configured = value?.trim();
  if (!configured && !development) throw new Error('VITE_API_BASE_URL is required for deployed System Admin pages.');
  const url = new URL(configured || 'https://educonnect-backend-staging.onrender.com');
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if ((url.protocol !== 'https:' && !(development && local && url.protocol === 'http:')) ||
      url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('VITE_API_BASE_URL must be an HTTPS server origin without an API path.');
  }
  return url.origin;
}
