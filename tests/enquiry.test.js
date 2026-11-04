import test from 'node:test';
import assert from 'node:assert/strict';
import { submitEnquiry, validateEnquiry } from '../src/lib/enquiry.js';
const valid = { name: 'Reviewer', email: 'reviewer@example.invalid', phone: '+234 (803) 123 4567', organizationName: 'Sample School', description: 'Please explain available tools and onboarding.' };
test('enquiry validation accepts international phones and rejects missing or oversized fields', () => {
  assert.deepEqual(validateEnquiry(valid), {});
  assert.equal(Object.keys(validateEnquiry({ name: '', email: '', phone: '', organizationName: '', description: '' })).length, 5);
  assert.ok(validateEnquiry({ ...valid, phone: '0803abc1234' }).phone);
  assert.ok(validateEnquiry({ ...valid, description: 'a'.repeat(1201) }).description);
});
test('enquiries retain the existing contact provider and payload without opening email', async () => {
  let calls = 0;
  await submitEnquiry(valid, async (url, options) => {
    calls++;
    assert.equal(url, 'https://api.web3forms.com/submit');
    assert.equal(options.method, 'POST');
    assert.equal(options.body.get('Organization Name'), valid.organizationName);
    for (const field of ['name', 'email', 'phone', 'description']) assert.equal(options.body.get(field), valid[field]);
    assert.ok(options.body.get('access_key'));
    return { ok: true, json: async () => ({ success: true }) };
  });
  assert.equal(calls, 1);
});
test('failed or malformed contact responses never report success or replay submission', async () => {
  for (const response of [
    { ok: false, json: async () => ({ success: true }) },
    { ok: true, json: async () => ({ success: false }) },
    { ok: true, json: async () => { throw new Error('HTML response'); } },
  ]) {
    let calls = 0;
    await assert.rejects(submitEnquiry(valid, async () => { calls++; return response; }));
    assert.equal(calls, 1);
  }
});
