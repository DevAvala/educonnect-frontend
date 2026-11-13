export function adminEmailDraft(email, subject, message) {
  if (typeof email !== 'string' || !/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(email) || /[\r\n]/.test(email)) return null;
  if (!subject.trim() || /[\r\n]/.test(subject) || subject.length > 160 || !message.trim() || message.length > 4000) return null;
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject.trim())}&body=${encodeURIComponent(message.trim())}`;
}
