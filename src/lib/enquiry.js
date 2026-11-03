export const enquiryFields = [
	"name",
	"email",
	"school",
	"message"
];
export function validateEnquiry(data) {
	const errors = {};
	if (!data.name.trim()) errors.name = "Please enter your name.";
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = "Enter a valid email address.";
	if (!data.school.trim()) errors.school = "Please enter your school or organisation.";
	if (data.message.trim().length < 10) errors.message = "Tell us a little more (at least 10 characters).";
	if (data.name.length > 100) errors.name = "Use 100 characters or fewer.";
	if (data.email.length > 254) errors.email = "Use 254 characters or fewer.";
	if (data.school.length > 150) errors.school = "Use 150 characters or fewer.";
	if (data.message.length > 1200) errors.message = "Use 1,200 characters or fewer.";
	return errors;
}
export function buildEmailDraft(data, destination) {
	const subject = `School enquiry: ${data.school.trim()}`;
	const body = `Name: ${data.name.trim()}\nEmail: ${data.email.trim()}\nSchool: ${data.school.trim()}\n\n${data.message.trim()}`;
	return `mailto:${destination}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
