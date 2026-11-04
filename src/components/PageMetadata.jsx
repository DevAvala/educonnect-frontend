import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageMetadata } from '../lib/site-metadata';

export default function PageMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const metadata = pageMetadata(pathname, {
      origin: import.meta.env.VITE_SITE_URL,
      indexable: import.meta.env.VITE_INDEXABLE,
    });
    document.title = metadata.title;
    for (const attributes of metadata.meta) {
      const key = attributes.name ? 'name' : 'property';
      let tag = document.head.querySelector(`meta[${key}="${attributes[key]}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        document.head.appendChild(tag);
      }
      for (const [name, value] of Object.entries(attributes)) tag.setAttribute(name, value);
    }
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!metadata.canonical) canonical?.remove();
    else {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = metadata.canonical;
    }
  }, [pathname]);
  return null;
}
