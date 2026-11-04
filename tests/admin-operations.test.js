import test from 'node:test';
import assert from 'node:assert/strict';
import { schoolDistribution, loadSchoolDistribution } from '../src/lib/admin-chart.js';
import { adminEmailDraft } from '../src/lib/admin-email.js';
test('school chart counts are disjoint and include deleted schools in the total', () => {
  assert.deepEqual(schoolDistribution({ total: 12, active: 6, inactive: 2, archived: 3 }), { active: 6, inactive: 2, archived: 3, deleted: 1 });
  assert.deepEqual(schoolDistribution({ total: 0, active: 0, inactive: 0, archived: 0 }), { active: 0, inactive: 0, archived: 0, deleted: 0 });
  assert.throws(() => schoolDistribution({ total: 3, active: 4, inactive: 0, archived: 0 }));
  assert.throws(() => schoolDistribution({ total: undefined, active: 0, inactive: 0, archived: 0 }));
});
test('chart uses existing list totals rather than counting a loaded page', async () => {
  const calls = [];
  const counts = { all: 99, active: 90, inactive: 5, archived: 2 };
  const api = { request: async (path, options) => { calls.push({ path, options }); return { schools: [], pagination: { total: counts[new URLSearchParams(path.split('?')[1]).get('status')] } }; } };
  const controller = new AbortController();
  assert.deepEqual(await loadSchoolDistribution(api, controller.signal), { active: 90, inactive: 5, archived: 2, deleted: 2 });
  assert.ok(calls.every(c => c.path.startsWith('/schools/management?') && c.path.endsWith('page=1&limit=1') && c.options.signal === controller.signal));
});
test('admin email drafts encode subject and message without adding recipients or headers', () => {
  const draft = adminEmailDraft('admin@example.invalid', 'A&B review?', 'Hello\nPlease review #1 & #2.');
  assert.ok(draft.startsWith('mailto:admin%40example.invalid?'));
  const query = new URLSearchParams(draft.split('?')[1]);
  assert.equal(query.get('subject'), 'A&B review?');
  assert.equal(query.get('body'), 'Hello\nPlease review #1 & #2.');
  assert.deepEqual([...query.keys()], ['subject','body']);
});
test('admin email drafts reject recipient/header injection and oversized content', () => {
  assert.equal(adminEmailDraft('admin@example.invalid\r\nBcc:x@example.invalid','Hello','Message'), null);
  assert.equal(adminEmailDraft('admin@example.invalid?bcc=x@example.invalid','Hello','Message'), null);
  assert.equal(adminEmailDraft('admin@example.invalid','Hi\nBcc:x@example.invalid','Message'), null);
  assert.equal(adminEmailDraft('admin@example.invalid','Hello','x'.repeat(4001)), null);
  assert.equal(adminEmailDraft('admin@example.invalid','  ','Message'), null);
});
