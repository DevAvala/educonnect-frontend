import test from 'node:test';
import assert from 'node:assert/strict';
import { createSystemAdminApi, ApiError, queryString } from '../src/lib/system-admin-api.js';
const user = { role: 'system_admin', email: 'test@example.invalid' };
const response = (data, status = 200) => ({ ok: status < 400, status, json: async () => ({ success: status < 400, data, ...(status >= 400 ? data : {}) }) });
const session = token => response({ token, user });

test('login and list requests use the documented paths, token header and nested pagination', async () => {
  const calls = [];
  const api = createSystemAdminApi('https://staging.example/', async (url, options) => {
    calls.push({ url, options });
    return calls.length === 1 ? session('test-token') : response({ schools: [], pagination: { total: 0, pages: 0 } });
  });
  await api.login('admin@example.com', 'test-password');
  const list = await api.request('/schools/management');
  assert.equal(list.pagination.total, 0);
  assert.equal(calls[0].url, 'https://staging.example/api/system-admin/auth/login');
  assert.equal(calls[0].options.credentials, 'include');
  assert.equal(calls[1].options.headers.Authorization, 'Bearer test-token');
});

test('preserves validation and conflict codes without retrying mutations', async () => {
  let count = 0;
  const api = createSystemAdminApi('https://staging.example', async () => { count++; return response({ code: 'CONFIRMATION_MISMATCH', message: 'Check name', errors: [{ field: 'confirmSchoolName', message: 'Mismatch' }] }, 400); });
  await assert.rejects(api.request('/schools/ABC1234/archive', { method: 'POST', body: { reason: 'A test reason', confirmSchoolName: 'Wrong school' } }), error => error instanceof ApiError && error.errors[0].field === 'confirmSchoolName');
  assert.equal(count, 1);
});

test('concurrent expired requests share one refresh, then retry once with a new token', async () => {
  let refreshCount = 0;
  const api = createSystemAdminApi('https://staging.example', async (url, options) => {
    if (url.endsWith('/auth/login')) return session('old');
    if (url.endsWith('/auth/refresh')) { refreshCount++; await new Promise(resolve => setTimeout(resolve, 1)); return session('new'); }
    return options.headers.Authorization === 'Bearer new' ? response({ value: 42 }) : response({ message: 'Expired' }, 401);
  });
  await api.login('a', 'b');
  const results = await Promise.all([api.request('/platform/overview'), api.request('/platform/kpis')]);
  assert.equal(refreshCount, 1);
  assert.deepEqual(results, [{ value: 42 }, { value: 42 }]);
});

test('failed logout clears the access token and notifies the session boundary', async () => {
  const calls = []; let expired = 0;
  const api = createSystemAdminApi('https://staging.example', async (_url, options) => {
    calls.push(options);
    return calls.length === 1 ? session('token') : response({ code: 'ACCESS_CHECK_FAILED', message: 'Try again' }, 503);
  });
  api.onSessionExpired(() => expired++);
  await api.login('a', 'b');
  await assert.rejects(api.logout(), error => error.code === 'ACCESS_CHECK_FAILED');
  await assert.rejects(api.request('/platform/overview'));
  assert.equal(calls[2].headers.Authorization, undefined);
  assert.equal(expired, 1);
});

test('multipart uploads keep the browser boundary and CSV downloads return a blob', async () => {
  const calls = [];
  const csv = new Blob(['firstName,lastName\nTest,Person']);
  const api = createSystemAdminApi('https://staging.example', async (url, options) => {
    calls.push({ url, options });
    return url.includes('/templates/') ? { ok: true, blob: async () => csv } : response({ dryRun: true });
  });
  const body = new FormData(); body.append('file', csv, 'test.csv');
  await api.request('/schools/ABC1234/import/students?dryRun=true', { method: 'POST', body });
  assert.equal(calls[0].options.headers['Content-Type'], undefined);
  assert.equal(calls[0].options.body, body);
  assert.equal(await api.download('/import/templates/students'), csv);
});

test('rejects malformed success payloads and non-admin login responses', async () => {
  const api = createSystemAdminApi('https://staging.example', async () => response({ token: 'token', user: { role: 'teacher' } }));
  await assert.rejects(api.login('a', 'b'), error => error.code === 'INVALID_SESSION');
  const malformed = createSystemAdminApi('https://staging.example', async () => response({ schools: [] }));
  await assert.rejects(malformed.request('/schools/management'), error => error.code === 'INVALID_RESPONSE');
});

test('refresh cannot resurrect a signed-out session', async () => {
  let finishRefresh;
  const api = createSystemAdminApi('https://staging.example', async url => url.endsWith('/auth/refresh') ? new Promise(resolve => { finishRefresh = () => resolve(session('late-token')); }) : response({ loggedOut: true }));
  const refreshing = api.refresh();
  await api.logout();
  finishRefresh();
  await assert.rejects(refreshing, error => error.code === 'SESSION_ENDED');
});

test('query values are encoded and empty filters omitted', () => {
  assert.equal(queryString({ search: 'a&b', status: '', page: 1 }), '?search=a%26b&page=1');
});
