import { defineConfig, loadEnv } from 'vite'
import process from 'node:process';
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import { pageMetadata, resolveSiteSettings } from './src/lib/site-metadata.js';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), 'VITE_');
  const site = resolveSiteSettings({
    origin: env.VITE_SITE_URL || 'https://educonnect.com.ng',
    allowIndexing: env.VITE_ALLOW_INDEXING,
    deployment: process.env.VERCEL_ENV || env.VITE_DEPLOY_ENV,
  });
  const metadata = pageMetadata('/', site);
  return {
    define: {
      'import.meta.env.VITE_SITE_URL': JSON.stringify(site.origin),
      'import.meta.env.VITE_INDEXABLE': JSON.stringify(site.indexable),
    },
    server: { allowedHosts: ['terminal.local'] },
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    plugins: [react(), tailwindcss(), {
      name: 'educonnect-site-metadata',
      transformIndexHtml(html) {
        return {
          html: html.replace(/<title>.*?<\/title>/, `<title>${metadata.title}</title>`),
          tags: [
            ...metadata.meta.map(attrs => ({ tag: 'meta', attrs, injectTo: 'head' })),
            { tag: 'link', attrs: { rel: 'canonical', href: metadata.canonical }, injectTo: 'head' },
          ],
        };
      },
    }],
  };
})
