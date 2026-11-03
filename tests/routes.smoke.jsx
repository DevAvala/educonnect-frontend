import { renderToPipeableStream } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { PassThrough } from 'node:stream';
import assert from 'node:assert/strict';
import App from '../src/App.jsx';

function renderRoute(route) {
  return new Promise((resolve, reject) => {
    let html = '';
    const output = new PassThrough();
    output.on('data', chunk => { html += chunk.toString(); });
    output.on('end', () => resolve(html));
    const stream = renderToPipeableStream(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>, {
      onAllReady() { stream.pipe(output); },
      onError(error) { reject(error); },
    });
  });
}
const routes = [
  ['/', 'A simpler way to run your school.'],
  ['/pricing', 'The Right Plan for Your School'],
  ['/contact', 'Do you have a specific inquiry?'],
  ['/legal-documents', 'Privacy Policy'],
  ['/legal-documents/privacy-policy', 'Privacy Policy'],
  ['/legal-documents/terms-of-service', 'Terms of Service'],
  ['/legal-documents/information-security', 'Information Security Policy'],
  ['/legal-documents/constructor', 'Document not found'],
  ['/legal-documents/__proto__', 'Document not found'],
  ['/legal-documents/does-not-exist', 'Document not found'],
  ['/super-admin', 'Checking your session'],
  ['/super-admin/schools', 'Checking your session'],
  ['/super-admin/schools/ABC1234', 'Checking your session'],
  ['/super-admin/users', 'Checking your session'],
  ['/super-admin/admins', 'Checking your session'],
  ['/super-admin/operations', 'Checking your session'],
  ['/super-admin/schools/ABC1234/operations', 'Checking your session'],
  ['/super-admin/schools/ABC1234?tab=staff&role=admin', 'Checking your session'],
  ['/super-admin/schools/ABC1234/operations/configuration', 'Checking your session'],
  ['/super-admin/imports', 'Checking your session'],
  ['/super-admin/audit-logs', 'Checking your session'],
  ['/does-not-exist', 'Page Not Found'],
];
for (const [route, expected] of routes) {
  const html = await renderRoute(route);
  assert.ok(html.includes(expected), `${route}: missing expected page content`);
  assert.ok(!html.includes('Switched to client rendering'), `${route}: server render failed`);
  if (route === '/') {
    for (const section of ['home','benefits','features','how-it-works','faqs','contact']) assert.ok(html.includes(`id="${section}"`));
    assert.equal((html.match(/role="tabpanel"/g)||[]).length,4);
    assert.equal((html.match(/class="faq-item"/g)||[]).length,6);
  }
  if (route === '/pricing') for(const price of ['150,000','350,000']) assert.ok(html.includes(price));
  if (route === '/contact') for(const name of ['name','email','phone','description','organizationName']) assert.ok(html.includes(`name="${name}"`));
  if(route.startsWith('/super-admin')) {
    for (const sample of ['Greenfield Academy', 'Bright Future College', 'EDU1001']) assert.ok(!html.includes(sample));
  }
  console.log('PASS', route);
}
console.log(`All ${routes.length} rendered route checks passed.`);
