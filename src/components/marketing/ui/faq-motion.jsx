import { useEffect } from "react";
/** Enhance native details while preserving keyboard and no-JS behaviour. */
export function FaqMotion() {
	useEffect(() => {
		const items = Array.from(document.querySelectorAll(".faq-list details"));
		if (!items.length || typeof items[0].animate !== "function") return;
		const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
		const running = new Map();
		const intended = new Map();
		const names = items.map((item) => item.getAttribute("name"));
		function finish(item, open) {
			running.get(item)?.cancel();
			running.delete(item);
			intended.delete(item);
			item.open = open;
			item.style.removeProperty("overflow");
		}
		function change(item, open) {
			const start = item.getBoundingClientRect().height;
			running.get(item)?.cancel();
			intended.set(item, open);
			if (motion.matches) {
				finish(item, open);
				return;
			}
			item.open = true;
			const summary = item.querySelector("summary");
			const border = parseFloat(getComputedStyle(item).borderBottomWidth) || 0;
			const end = open ? item.scrollHeight + border : summary.getBoundingClientRect().height + border;
			item.style.overflow = "hidden";
			const animation = item.animate([{ height: `${start}px` }, { height: `${end}px` }], {
				duration: 320,
				easing: "cubic-bezier(.22,.61,.36,1)"
			});
			running.set(item, animation);
			animation.onfinish = () => finish(item, open);
		}
		const cleanups = items.map((item) => {
			// Manage sibling closing so it can animate too; native grouping remains without JS.
			item.removeAttribute("name");
			const summary = item.querySelector("summary");
			const click = (event) => {
				event.preventDefault();
				const open = !(intended.get(item) ?? item.open);
				if (open) items.forEach((other) => {
					if (other !== item && (intended.get(other) ?? other.open)) change(other, false);
				});
				change(item, open);
			};
			summary.addEventListener("click", click);
			return () => summary.removeEventListener("click", click);
		});
		const reduced = () => {
			if (motion.matches) Array.from(intended).forEach(([item, open]) => finish(item, open));
		};
		motion.addEventListener("change", reduced);
		return () => {
			cleanups.forEach((cleanup) => cleanup());
			Array.from(intended).forEach(([item, open]) => finish(item, open));
			items.forEach((item, index) => {
				if (names[index]) item.setAttribute("name", names[index]);
			});
			motion.removeEventListener("change", reduced);
		};
	}, []);
	return null;
}
