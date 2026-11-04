import { useEffect } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PublicLayout } from '@/components/marketing/layout/public-layout';
import { Container } from '@/components/marketing/ui/container';
import { loadNeetoCalEmbed } from '../utils/functions';
import ContactPage from './ContactForm';

export default function Contact() {
  useEffect(() => loadNeetoCalEmbed(), []);
  return <PublicLayout title="Contact">
    <section id="contact" className="section contact-page">
      <Container>
        <div className="page-intro">
          <p className="eyebrow">Contact EduConnect</p>
          <h1>Do you have a specific inquiry?</h1>
          <p>Reach out!</p>
        </div>
        <div className="contact-page-grid">
          <div className="contact-form"><ContactPage /></div>
          <aside className="contact-page-info">
            <h2>Turning big ideas into real solutions.</h2>
            <p>We're a passionate startup focused on delivering high-impact digital products that matter. Let's build something great together.</p>
            <div className="contact-details">
              <div><MapPin size={22} aria-hidden="true" /><p><strong>EduConnect Digital Solutions</strong><br />Abuja, Nigeria</p></div>
              <a href="mailto:info@educonnect.com.ng"><Mail size={22} aria-hidden="true" />info@educonnect.com.ng</a>
              <a href="tel:+2348012345678"><Phone size={22} aria-hidden="true" />+234 801 234 5678</a>
            </div>
          </aside>
        </div>
      </Container>
    </section>
    <section id="schedule-meet" className="section schedule-section">
      <Container>
        <div className="section-heading"><h2>Schedule a meeting with us</h2></div>
        <div className="calendar-embed" id="inline-embed-container" />
      </Container>
    </section>
  </PublicLayout>;
}
