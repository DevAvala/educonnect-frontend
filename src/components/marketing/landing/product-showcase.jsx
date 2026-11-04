import { useRef, useState } from "react";
import { features } from "@/content/marketing/features";
import { Container } from "@/components/marketing/ui/container";
import { SectionHeading } from "@/components/marketing/ui/section-heading";
import { DashboardPreview } from "./dashboard-preview";
export function ProductShowcase() {
	const [active, setActive] = useState(0);
	const tabs = useRef([]);
	const tablist = useRef(null);
	function activate(index) {
		setActive(index);
		const selected = tabs.current[index];
		const container = tablist.current;
		if (!selected || !container) return;
		// Centre the active tab within the horizontal strip on narrow phones.
		// Do not scroll the entire page when visitors switch features.
		const left = selected.offsetLeft - (container.clientWidth - selected.clientWidth) / 2;
		container.scrollTo({
			left,
			behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
		});
	}
	function onKey(event, index) {
		const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
		if (!direction && event.key !== "Home" && event.key !== "End") return;
		event.preventDefault();
		const next = event.key === "Home" ? 0 : event.key === "End" ? features.length - 1 : (index + direction + features.length) % features.length;
		activate(next);
		tabs.current[next]?.focus();
	}
	return <section id="features" className="section product-section" aria-labelledby="features-title">
      <Container>
        <SectionHeading title="Everything your school needs, together." id="features-title" centered />

        <div className="product-tabs" role="tablist" aria-label="Explore EduConnect features" ref={tablist}>
          {features.map((feature, i) => <button key={feature.id} ref={(element) => {
		tabs.current[i] = element;
	}} id={`tab-${feature.id}`} role="tab" type="button" aria-selected={active === i} aria-controls={`panel-${feature.id}`} tabIndex={active === i ? 0 : -1} onClick={() => activate(i)} onKeyDown={(event) => onKey(event, i)}>
              <span className="tab-number">0{i + 1}</span>
              {feature.label}
            </button>)}
        </div>

        {features.map((feature, i) => <div key={feature.id} id={`panel-${feature.id}`} role="tabpanel" aria-labelledby={`tab-${feature.id}`} hidden={active !== i} tabIndex={0} className="product-panel feature-spotlight">
            <div className="product-copy">
              <h3>{feature.heading}</h3>
              <p>{feature.description}</p>
            </div>
            <div className="product-preview">
              <DashboardPreview view={feature.id} />
            </div>
          </div>)}

      </Container>
    </section>;
}
