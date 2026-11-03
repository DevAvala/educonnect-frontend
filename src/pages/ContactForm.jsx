import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/marketing/ui/button';

const initial = { name: '', email: '', phone: '', description: '', organizationName: '' };
const fields = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'organizationName', label: 'Organization Name', type: 'text', autoComplete: 'organization' },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState(initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const form = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const next = {};
    if (!formData.name.trim()) next.name = 'Name is required';
    if (!formData.organizationName.trim()) next.organizationName = 'Organization Name is required';
    if (!formData.description.trim()) next.description = 'Description is required';
    if (!formData.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = 'Please enter a valid email';
    if (!formData.phone.trim()) next.phone = 'Phone Number is required';
    else if (!/^\d{7,15}$/.test(formData.phone)) next.phone = 'Please enter a valid phone number';
    setErrors(next);
    if (Object.keys(next).length) {
      form.current?.elements.namedItem(Object.keys(next)[0])?.focus();
      return;
    }
    setIsSubmitting(true);
    // Preserve the existing contact provider and its payload. No new backend integration.
    const payload = new FormData();
    payload.append('access_key', '41706b4e-db86-48a7-9570-4ecd950c62da');
    for (const key of ['name', 'email', 'phone', 'description']) payload.append(key, formData[key]);
    payload.append('Organization Name', formData.organizationName);
    try {
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: payload });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsSubmitted(true);
        setFormData(initial);
      } else setErrors({ general: data.message || 'An error occurred during submission.' });
    } catch {
      setErrors({ general: 'A network error occurred. Please try again.' });
    } finally { setIsSubmitting(false); }
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
        <label htmlFor={`contact-${field.name}`}>{field.label} <span className="required-asterisk" aria-hidden="true">*</span></label>
        <input id={`contact-${field.name}`} name={field.name} type={field.type} autoComplete={field.autoComplete} value={formData[field.name]} onChange={handleChange} required
          aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `contact-error-${field.name}` : undefined} />
        {errors[field.name] && <p className="field-error" id={`contact-error-${field.name}`}>{errors[field.name]}</p>}
      </div>)}
      <div className="field field--full">
        <label htmlFor="contact-description">Describe your need <span className="required-asterisk" aria-hidden="true">*</span></label>
        <textarea id="contact-description" name="description" rows={5} required value={formData.description} onChange={handleChange}
          aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? 'contact-error-description' : undefined} />
        {errors.description && <p id="contact-error-description" className="field-error">{errors.description}</p>}
      </div>
    </div>
    <p className="form-legal">By submitting this form I agree to the <Link to="/legal-documents/privacy-policy">Privacy Policy</Link> and <Link to="/legal-documents/terms-of-service">Terms of Service</Link></p>
    {errors.general && <p className="field-error" role="alert">{errors.general}</p>}
    <Button type="submit" loading={isSubmitting} className="form-submit">{isSubmitting ? 'Sending...' : 'Send Enquiry'}</Button>
  </form>;
}
