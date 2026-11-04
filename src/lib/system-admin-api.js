/** Backend contract: DevAvala/educonnect-backend, dev branch. No tokens in storage. */
export class ApiError extends Error {
  constructor(message, status = 0, code, errors = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}
export const queryString = (values = {}) => {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== '' && value != null) params.set(key, String(value));
  });
  return params.size ? `?${params}` : '';
};
export function createSystemAdminApi(baseUrl, fetcher = fetch) {
  const url = new URL(baseUrl);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error('Invalid API base URL');
  const base = url.href.replace(/\/$/, '') + '/api/system-admin';
  let token = null;
  let version = 0;
  let refreshing = null;
  const listeners = new Set();
  const expire = () => { token = null; version++; listeners.forEach(fn => fn()); };
  async function send(path, { method = 'GET', body, authenticated = true, signal, download = false } = {}) {
    const headers = { Accept: download ? 'text/csv' : 'application/json' };
    if (authenticated && token) headers.Authorization = `Bearer ${token}`;
    const multipart = body instanceof FormData;
    if (body !== undefined && !multipart) headers['Content-Type'] = 'application/json';
    let response;
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) controller.abort();
    signal?.addEventListener('abort', abort, { once: true });
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      response = await fetcher(base + path, { method, headers, credentials: 'include', signal: controller.signal,
        ...(body !== undefined ? { body: multipart ? body : JSON.stringify(body) } : {}) });
    } catch (error) {
      if (signal?.aborted) throw error;
      if (controller.signal.aborted) throw new ApiError('The server took too long to respond. For a submitted change, check the records before trying again.', 0, 'REQUEST_TIMEOUT');
      throw new ApiError('Unable to reach the server. Check your connection and try again.', 0, 'NETWORK_ERROR');
    } finally {
      clearTimeout(timeout); signal?.removeEventListener('abort', abort);
    }
    if (response.ok && download) return response.blob();
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.success) throw new ApiError(payload?.message || 'Unable to complete the request.', response.status, payload?.code, payload?.errors);
    if (payload.data == null) throw new ApiError('The server returned an unexpected response.', response.status, 'INVALID_RESPONSE');
    if (method === 'GET') {
      const pathname = path.split('?')[0];
      const collection = pathname === '/schools/management' ? 'schools' : pathname === '/users/management' ? 'users' : pathname === '/audit-logs' ? 'logs' : /^\/schools\/[^/]+\/(students|staff)$/.exec(pathname)?.[1];
      if (collection && (!Array.isArray(payload.data[collection]) || !Number.isFinite(payload.data.pagination?.total) || !Number.isFinite(payload.data.pagination?.pages))) {
        throw new ApiError('The server returned an unexpected list format. Please try again or contact support.', response.status, 'INVALID_RESPONSE');
      }

    }
    return payload.data;
  }
  async function authenticate(path, body) {
    const current = version;
    const data = await send(path, { method: 'POST', body, authenticated: false });
    if (current !== version) throw new ApiError('Your session has ended. Please sign in again.', 401, 'SESSION_ENDED');
    if (typeof data?.token !== 'string' || !data.token || data?.user?.role !== 'system_admin') {
      throw new ApiError('A valid System Admin session is required.', 401, 'INVALID_SESSION');
    }
    token = data.token;
    return data.user;
  }
  async function refresh() {
    if (!refreshing) refreshing = authenticate('/auth/refresh').finally(() => { refreshing = null; });
    return refreshing;
  }
  async function request(path, options = {}) {
    const current = version;
    try { return await send(path, options); }
    catch (error) {
      if (error.status !== 401 || options.authenticated === false) throw error;
      try {
        await refresh();
        if (current !== version) throw new ApiError('Your session has ended.', 401);
        return await send(path, options);
      } catch (refreshError) {
        if (refreshError.status === 401 || refreshError.status === 403) expire();
        throw refreshError;
      }
    }
  }
  return {
    login(email, password) { version++; token = null; return authenticate('/auth/login', { email, password }); },
    refresh,
    async logout() { try { await send('/auth/logout', { method: 'POST' }); } finally { expire(); } },
    onSessionExpired(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    request,
    download(path) { return request(path, { download: true }); },
  };
}
