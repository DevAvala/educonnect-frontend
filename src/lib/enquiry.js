export const enquiryLimits = { name: 100, email: 254, phone: 30, organizationName: 150, description: 1200 };
export function validateEnquiry(data) {
  const errors = {};
  if (!data.name.trim()) errors.name = 'Name is required';
  if (!data.organizationName.trim()) errors.organizationName = 'Organization Name is required';
  if (!data.description.trim()) errors.description = 'Description is required';
  if (!data.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'Please enter a valid email';
  const phone = data.phone.trim();
  if (!phone) errors.phone = 'Phone Number is required';
  else if (!/^\+?[\d\s()-]+$/.test(phone) || !/^\d{7,15}$/.test(phone.replace(/\D/g, ''))) errors.phone = 'Please enter a valid phone number';
  for (const [field, limit] of Object.entries(enquiryLimits)) {
    if (data[field].length > limit) errors[field] = `Use ${limit} characters or fewer.`;
  }
  return errors;
}

export async function submitEnquiry(data, fetcher = fetch) {
  const payload = new FormData();
  // Retain the existing public Web3Forms key and payload, shared by both forms.
  payload.append('access_key', '41706b4e-db86-48a7-9570-4ecd950c62da');
  for (const field of ['name', 'email', 'phone', 'description']) payload.append(field, data[field].trim());
  payload.append('Organization Name', data.organizationName.trim());
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetcher('https://api.web3forms.com/submit', { method: 'POST', body: payload, signal: controller.signal });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.success !== true) throw new Error('Your enquiry could not be submitted. Please try again.');
  } catch (error) {
    if (controller.signal.aborted) throw new Error('The server took too long to respond. Please try again shortly.');
    throw error;
  } finally { clearTimeout(timeout); }
}
