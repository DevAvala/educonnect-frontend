import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './header';
import { Footer } from './footer';
import '@/styles/marketing.css';
import '@/styles/public-pages.css';

export function PublicLayout({ title, children, className = '' }) {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // Wait for the lazy page to mount before resolving a cross-page section link.
    const frame = requestAnimationFrame(() => {
      let targetId = hash.slice(1);
      try { targetId = decodeURIComponent(targetId); } catch { /* Keep malformed fragments harmless. */ }
      const target = hash && document.getElementById(targetId);
      if (target) target.scrollIntoView();
      else window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, title]);
  return <div className={`public-site ${className}`}>
    <a href="#main-content" className="skip-link">Skip to content</a>
    <Header />
    <main id="main-content">{children}</main>
    <Footer />
  </div>;
}
