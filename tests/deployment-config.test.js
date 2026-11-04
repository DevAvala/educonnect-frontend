import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveAdminOrigin } from '../src/lib/admin-config.js';
import { pageMetadata, resolveSiteSettings } from '../src/lib/site-metadata.js';

test('deployed admin requires an explicit HTTPS origin and never defaults to staging', () => {
  assert.throws(() => resolveAdminOrigin(undefined));
  for (const value of ['https://api.example/api', 'https://api.example/?x=1', 'https://user:pass@api.example', 'http://api.example', 'not a URL']) assert.throws(() => resolveAdminOrigin(value));
  assert.equal(resolveAdminOrigin(' https://api.example/ '), 'https://api.example');
  assert.equal(resolveAdminOrigin('http://localhost:4000', true), 'http://localhost:4000');
});
test('preview stays noindex even when indexing was enabled for production', () => {
  assert.equal(resolveSiteSettings({ deployment: 'preview', allowIndexing: 'true' }).indexable, false);
  assert.equal(resolveSiteSettings({ deployment: 'production' }).indexable, false);
  assert.equal(resolveSiteSettings({ deployment: 'production', allowIndexing: 'true' }).indexable, true);
  assert.throws(() => resolveSiteSettings({ origin: 'https://educonnect.com.ng/wrong-path' }));
});
test('public canonical URLs and social metadata are restored while admin/error pages stay noindex', () => {
  const site = resolveSiteSettings({ deployment: 'production', allowIndexing: 'true' });
  const pricing = pageMetadata('/pricing', site);
  assert.equal(pricing.canonical, 'https://educonnect.com.ng/pricing');
  assert.ok(pricing.meta.some(x => x.name === 'robots' && x.content === 'index, follow'));
  assert.ok(pricing.meta.some(x => x.property === 'og:image' && x.content.endsWith('/brand/educonnect-logo.png')));
  for (const path of ['/super-admin', '/super-admin/schools', '/legal-documents/missing', '/missing']) {
    const metadata = pageMetadata(path, site);
    assert.equal(metadata.canonical, null);
    assert.ok(metadata.meta.some(x => x.name === 'robots' && x.content === 'noindex, nofollow'));
  }
});
