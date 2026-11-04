import { Mail, MapPin } from 'lucide-react';
import { company } from '@/content/marketing/site';
import { Container } from '@/components/marketing/ui/container';
import ContactPage from '@/pages/ContactForm';

export function ContactSection() {
  return <section id="contact" className="section contact-section" aria-labelledby="contact-title">
    <Container><div className="contact-grid">
      <div className="contact-copy">
        <h2 id="contact-title">Let’s talk about your school.</h2>
        <p>Tell us what your school needs.</p>
        <a href={`mailto:${company.email}`} className="contact-email">
          <Mail size={20} aria-hidden="true" /><span>{company.email}</span>
        </a>
        <p className="contact-location"><MapPin size={16} aria-hidden="true" />{company.location}</p>
      </div>
      <div className="contact-form">
        <div className="form-heading"><h3>Your school enquiry</h3></div>
        <ContactPage idPrefix="homepage" />
      </div>
    </div></Container>
  </section>;
}
