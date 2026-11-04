import { useEffect } from "react";
/** Enhance server-rendered content without a scroll listener or motion library. */
export function ScrollReveals() {
	useEffect(() => {
		const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (!("IntersectionObserver" in window)) return;
		const targets = Array.from(document.querySelectorAll("main .section-heading, .benefit-card, .steps > li, .local-context, .contact-copy, .contact-form"));
		const reveal = (element) => {
			element.classList.remove("reveal-pending");
			observer.unobserve(element);
		};
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) reveal(entry.target);
			});
		}, { threshold: .08 });
		// Read positions before writing styles, and never hide content already in view.
		const belowFold = targets.filter((target) => target.getBoundingClientRect().top >= window.innerHeight);
		if (!preference.matches) {
			belowFold.forEach((target) => {
				target.dataset.scrollReveal = "";
				target.classList.add("reveal-pending");
				observer.observe(target);
			});
		}
		const showAll = () => {
			if (preference.matches) targets.forEach(reveal);
		};
		const onFocus = (event) => {
			if (event.target instanceof Element) {
				const parent = event.target.closest(".reveal-pending");
				if (parent) reveal(parent);
			}
		};
		preference.addEventListener("change", showAll);
		document.addEventListener("focusin", onFocus);
		return () => {
			observer.disconnect();
			preference.removeEventListener("change", showAll);
			document.removeEventListener("focusin", onFocus);
			targets.forEach((target) => {
				target.classList.remove("reveal-pending");
				delete target.dataset.scrollReveal;
			});
		};
	}, []);
	return null;
}
