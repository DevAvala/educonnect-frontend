import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/marketing/ui/button';
import { enquiryLimits, submitEnquiry, validateEnquiry } from '@/lib/enquiry';

const initial = { name: '', email: '', phone: '', description: '', organizationName: '' };
const fields = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'organizationName', label: 'Organization Name', type: 'text', autoComplete: 'organization' },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
];

export default function ContactPage({ idPrefix = 'contact' }) {
  const [formData, setFormData] = useState(initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const form = useRef(null);
  const submitting = useRef(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting.current) return;
    const next = validateEnquiry(formData);
    setErrors(next);
    if (Object.keys(next).length) {
      form.current?.elements.namedItem(Object.keys(next)[0])?.focus();
      return;
    }
    submitting.current = true;
    setIsSubmitting(true);
    try {
      await submitEnquiry(formData);
      setIsSubmitted(true);
      setFormData(initial);
    } catch (error) {
      setErrors({ general: error instanceof TypeError ? 'A network error occurred. Please try again.' : error.message });
    } finally { submitting.current = false; setIsSubmitting(false); }
  }
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(previous => ({ ...previous, [name]: value }));
    setErrors(previous => ({ ...previous, [name]: undefined, general: undefined }));
  }
  if (isSubmitted) return <div className="draft-ready" role="status">
    <h2>Your inquiry has been successfully submitted!</h2>
    <p>We'll reach back out to you as soon as possible.</p>
    <Button type="button" onClick={() => setIsSubmitted(false)}>Send another enquiry</Button>
  </div>;
  return <form ref={form} onSubmit={handleSubmit} noValidate aria-label="Contact enquiry">
    <div className="form-fields">
      {fields.map(field => <div className="field" key={field.name}>
        <label htmlFor={`${idPrefix}-${field.name}`}>{field.label} <span className="required-asterisk" aria-hidden="true">*</span></label>
        <input id={`${idPrefix}-${field.name}`} name={field.name} type={field.type} autoComplete={field.autoComplete} maxLength={enquiryLimits[field.name]} value={formData[field.name]} onChange={handleChange} required
          aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `${idPrefix}-error-${field.name}` : undefined} />
        {errors[field.name] && <p className="field-error" id={`${idPrefix}-error-${field.name}`}>{errors[field.name]}</p>}
      </div>)}
      <div className="field field--full">
        <label htmlFor={`${idPrefix}-description`}>Describe your need <span className="required-asterisk" aria-hidden="true">*</span></label>
        <textarea id={`${idPrefix}-description`} name="description" rows={5} required maxLength={enquiryLimits.description} value={formData.description} onChange={handleChange}
          aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? `${idPrefix}-error-description` : undefined} />
        {errors.description && <p id={`${idPrefix}-error-description`} className="field-error">{errors.description}</p>}
      </div>
    </div>
    <p className="form-legal">By submitting this form I agree to the <Link to="/legal-documents/privacy-policy">Privacy Policy</Link> and <Link to="/legal-documents/terms-of-service">Terms of Service</Link></p>
    {errors.general && <p className="field-error" role="alert">{errors.general}</p>}
    <Button type="submit" loading={isSubmitting} className="form-submit">{isSubmitting ? 'Sending...' : 'Send Enquiry'}</Button>
  </form>;
}
