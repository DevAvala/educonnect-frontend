import test from 'node:test';
import assert from 'node:assert/strict';
import { pageMetadata, resolveSiteSettings } from '../src/lib/site-metadata.js';

test('preview stays noindex even when indexing was enabled for production', () => {
  assert.equal(resolveSiteSettings({ deployment: 'preview', allowIndexing: 'true' }).indexable, false);
  assert.equal(resolveSiteSettings({ deployment: 'production' }).indexable, false);
  assert.equal(resolveSiteSettings({ deployment: 'production', allowIndexing: 'true' }).indexable, true);
  assert.throws(() => resolveSiteSettings({ origin: 'https://educonnect.com.ng/wrong-path' }));
});
test('public canonical URLs and social metadata are restored while unknown pages stay noindex', () => {
  const site = resolveSiteSettings({ deployment: 'production', allowIndexing: 'true' });
  const pricing = pageMetadata('/pricing', site);
  assert.equal(pricing.canonical, 'https://educonnect.com.ng/pricing');
  assert.ok(pricing.meta.some(x => x.name === 'robots' && x.content === 'index, follow'));
  assert.ok(pricing.meta.some(x => x.property === 'og:image' && x.content.endsWith('/brand/educonnect-logo.png')));
  for (const path of ['/legal-documents/missing', '/missing']) {
    const metadata = pageMetadata(path, site);
    assert.equal(metadata.canonical, null);
    assert.ok(metadata.meta.some(x => x.name === 'robots' && x.content === 'noindex, nofollow'));
  }
});
