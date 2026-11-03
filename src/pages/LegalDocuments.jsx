import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import GithubSlugger from 'github-slugger';
import { Link, useParams } from 'react-router-dom';
import { PublicLayout } from '@/components/marketing/layout/public-layout';
import { Container } from '@/components/marketing/ui/container';
import termsOfService from '../Mds/terms_of_service.md?raw';
import infoSecurity from '../Mds/information_security_policy.md?raw';
import privacyPolicy from '../Mds/privacy_policy.md?raw';
import contactImage from '../assets/images/CTA_image.jpg';

const documents = {
  'privacy-policy': { title: 'Privacy Policy', subtitle: 'OUR PRIVACY POLICY', content: privacyPolicy },
  'terms-of-service': { title: 'Terms of Service', subtitle: 'OUR TERMS OF SERVICE', content: termsOfService },
  'information-security': { title: 'Information Security Policy', subtitle: 'OUR INFORMATION SECURITY POLICY', content: infoSecurity },
};
function extractHeadings(markdown) {
  const slugger = new GithubSlugger();
  return [...markdown.matchAll(/^(#{1,3})\s+(.+)$/gm)].map(([, hashes, text]) => ({
    level: hashes.length, text, slug: slugger.slug(text),
  }));
}
export default function LegalDocuments() {
  const { docId = 'privacy-policy' } = useParams();
  const currentDoc = Object.hasOwn(documents, docId) ? documents[docId] : null;
  if (!currentDoc) return <PublicLayout title="Document not found">
    <Container className="section"><div className="page-intro"><h1>Document not found</h1><p><Link to="/legal-documents/privacy-policy">Browse our legal documents</Link></p></div></Container>
  </PublicLayout>;
  return <PublicLayout title={currentDoc.title}>
    <Container className="section legal-page">
      <nav className="breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span>{currentDoc.title}</span></nav>
      <div className="legal-grid">
        <aside className="legal-sidebar">
          <nav aria-label="Legal documents">
            <p className="eyebrow">Documentation</p>
            {Object.entries(documents).map(([key, doc]) => <Link key={key} to={`/legal-documents/${key}`} aria-current={key === docId ? 'page' : undefined}>{doc.title}</Link>)}
          </nav>
          <nav className="legal-toc" aria-label="On this page">
            <h2>On this page</h2>
            {extractHeadings(currentDoc.content).map((heading) => <a key={heading.slug} href={`#${heading.slug}`} style={{ paddingLeft: (heading.level - 1) * 12 }}>{heading.text}</a>)}
          </nav>
        </aside>
        <article className="legal-article">
          <div className="page-intro"><p className="eyebrow">{currentDoc.subtitle}</p><h1>{currentDoc.title}<span className="text-brand">.</span></h1></div>
          <div className="legal-prose prose max-w-none"><ReactMarkdown rehypePlugins={[rehypeSlug]}>{currentDoc.content}</ReactMarkdown></div>
        </article>
      </div>
    </Container>
    <section className="section legal-cta"><Container>
      <img src={contactImage} alt="Teacher meeting with parents and students" loading="lazy" />
      <div><h2>One platform for parents, teachers, and students to stay in sync.</h2><p>From classroom updates to progress tracking, EduConnect keeps everyone connected and informed with zero effort.</p><Link className="button button--primary" to="/contact#schedule-meet">Schedule a Call</Link></div>
    </Container></section>
  </PublicLayout>;
}
