export const defaultDescription = 'School administration, academic records and parent communication in one connected platform.';
const pages = {
  '/': 'Connected School Management',
  '/pricing': 'Pricing',
  '/contact': 'Contact',
  '/legal-documents': 'Privacy Policy',
  '/legal-documents/privacy-policy': 'Privacy Policy',
  '/legal-documents/terms-of-service': 'Terms of Service',
  '/legal-documents/information-security': 'Information Security Policy',
};

export function resolveSiteSettings({ origin = 'https://educonnect.com.ng', allowIndexing, deployment } = {}) {
  const url = new URL(origin);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('VITE_SITE_URL must be an HTTPS site origin without a path.');
  }
  return { origin: url.origin, indexable: deployment === 'production' && allowIndexing === 'true' };
}

export function pageMetadata(pathname, { origin = 'https://educonnect.com.ng', indexable = false } = {}) {
  const path = pathname.replace(/\/$/, '') || '/';
  const publicPage = Object.hasOwn(pages, path);
  const title = `${publicPage ? pages[path] : path.startsWith('/super-admin') ? 'System Administration' : 'Page Not Found'} | EduConnect`;
  const canonical = publicPage ? new URL(path, origin).href : null;
  const image = new URL('/brand/educonnect-logo.png', origin).href;
  return {
    title, canonical,
    meta: [
      { name: 'description', content: defaultDescription },
      { name: 'robots', content: publicPage && indexable ? 'index, follow' : 'noindex, nofollow' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: defaultDescription },
      { property: 'og:url', content: canonical || origin + '/' },
      { property: 'og:image', content: image },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: defaultDescription },
      { name: 'twitter:image', content: image },
    ],
  };
}
