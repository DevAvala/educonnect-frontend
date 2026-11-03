import { Plus } from "lucide-react";
import { Container } from "@/components/marketing/ui/container";
import { SectionHeading } from "@/components/marketing/ui/section-heading";
import { faqs } from "@/content/marketing/faq";
export function FaqSection() {
	return <section id="faqs" className="section faq-section" aria-labelledby="faq-title">
      <Container>
        <div className="local-context">
          <div className="local-copy">
            <h2>Built for Nigerian schools.</h2>
            <p>
              Practical school tools, with onboarding and training focused on local needs.
            </p>
          </div>
          <div className="local-image">
            <img src="/images/students-at-laptop.webp" alt="Two schoolboys sharing a laptop" className="cover-image" sizes="(min-width: 768px) 400px, 100vw" />
          </div>
        </div>
        <div className="faq-grid">
          <SectionHeading title="Frequently asked questions." id="faq-title" />
          <div className="faq-list">
            {faqs.map((faq) => <details className="faq-item" key={faq.question} name="educonnect-faq">
                <summary>
                  <h3>{faq.question}</h3>
                  <Plus className="faq-plus" size={18} aria-hidden="true" />
                </summary>
                <div className="faq-answer"><p>{faq.answer}</p></div>
              </details>)}
          </div>
        </div>
      </Container>
    </section>;
}
