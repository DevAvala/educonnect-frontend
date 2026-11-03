import { useRef, useState } from "react";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { company, legalLinks } from "@/content/marketing/site";
import { buildEmailDraft, enquiryFields, validateEnquiry } from "@/lib/enquiry";
import { Button } from "@/components/marketing/ui/button";
import { Container } from "@/components/marketing/ui/container";
export function ContactSection() {
	const [errors, setErrors] = useState({});
	const [draft, setDraft] = useState(null);
	const form = useRef(null);
	function prepare(event) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const data = Object.fromEntries(enquiryFields.map((field) => [field, String(formData.get(field) ?? "")]));
		const nextErrors = validateEnquiry(data);
		setErrors(nextErrors);
		setDraft(null);
		const invalid = enquiryFields.find((field) => nextErrors[field]);
		if (invalid) {
			form.current?.querySelector(`[name="${invalid}"]`)?.focus();
			return;
		}
		const emailDraft = buildEmailDraft(data, company.email);
		setDraft(emailDraft);
		// User initiated submission: launch their email composer immediately.
		// Show a fallback link because some browsers don't have an email app configured.
		window.location.href = emailDraft;
	}
	const fields = [
		{
			name: "name",
			label: "Your name",
			type: "text",
			placeholder: "Full name",
			autoComplete: "name",
			max: 100
		},
		{
			name: "email",
			label: "Email address",
			type: "email",
			placeholder: "you@school.com",
			autoComplete: "email",
			max: 254
		},
		{
			name: "school",
			label: "School or organisation",
			type: "text",
			placeholder: "Your school name",
			autoComplete: "organization",
			max: 150
		}
	];
	return <section id="contact" className="section contact-section" aria-labelledby="contact-title">
      <Container>
        <div className="contact-grid">
          <div className="contact-copy">
            <h2 id="contact-title">Let’s talk about your school.</h2>
            <p>
              Tell us what your school needs.
            </p>
            <a href={`mailto:${company.email}`} className="contact-email">
              <Mail size={20} aria-hidden="true" />
              <span>{company.email}</span>
            </a>
            <p className="contact-location">
              <MapPin size={16} aria-hidden="true" />
              {company.location}
            </p>
          </div>
          <form ref={form} onSubmit={prepare} onChange={() => {
		if (draft) setDraft(null);
	}} noValidate className="contact-form" aria-label="School enquiry" aria-describedby="enquiry-privacy">
            <div className="form-heading">
              <h3>Your school enquiry</h3>
            </div>
            <div className="form-fields">
              {fields.map((field) => <div key={field.name} className={`field ${field.name === "school" ? "field--full" : ""}`}>
                  <label htmlFor={`enquiry-${field.name}`}>
                    <span>{field.label}</span>
                    <span className="required-asterisk" aria-hidden="true">*</span>
                  </label>
                  <input id={`enquiry-${field.name}`} name={field.name} type={field.type} autoComplete={field.autoComplete} placeholder={field.placeholder} maxLength={field.max} required aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `error-${field.name}` : undefined} />
                  {errors[field.name] && <p id={`error-${field.name}`} className="field-error">
                      {errors[field.name]}
                    </p>}
                </div>)}
              <div className="field field--full">
                <label htmlFor="enquiry-message">
                  <span>How can EduConnect help?</span>
                  <span className="required-asterisk" aria-hidden="true">*</span>
                </label>
                <textarea id="enquiry-message" name="message" rows={3} minLength={10} maxLength={1200} placeholder="What does your school need?" required aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "error-message enquiry-sensitive" : "enquiry-sensitive"} />
                {errors.message && <p id="error-message" className="field-error">
                    {errors.message}
                  </p>}
                <p id="enquiry-sensitive" className="field-help">
                  Please do not include student records or sensitive
                  information.
                </p>
              </div>
            </div>
            <p id="enquiry-privacy" className="form-legal">
              Review EduConnect’s{" "}
              <a href={legalLinks[0].href}>Privacy Policy</a> and{" "}
              <a href={legalLinks[1].href}>Terms of Service</a> before sending
              your enquiry.
            </p>
            <div aria-live="polite" aria-atomic="true">
              {Object.keys(errors).length > 0 && <p className="field-error form-error-summary" role="alert">
                  Please correct the highlighted fields.
                </p>}
              {draft && <div className="draft-ready">
                  <strong>Your email enquiry is ready.</strong>
                  <p>
                    Your email app should open. Please review and send your message; this website has not sent it for you.
                  </p>
                  <a className="button button--primary" href={draft}>
                    Open email draft{" "}
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                  <p className="field-help">
                    If no email app opens, email {company.email} directly.
                  </p>
                </div>}
            </div>
            {!draft && <Button type="submit" className="form-submit">
                Continue in Email App
              </Button>}
          </form>
        </div>
      </Container>
    </section>;
}
