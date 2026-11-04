import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navigation, schoolApp } from "@/content/marketing/site";
import { ButtonLink } from "@/components/marketing/ui/button";
import { Container } from "@/components/marketing/ui/container";
export function Header() {
	const [open, setOpen] = useState(false);
	const toggle = useRef(null);
	const panel = useRef(null);
	const header = useRef(null);
	useEffect(() => {
		if (!header.current || !("ResizeObserver" in window)) return;
		const element = header.current.querySelector(".header-inner");
		if (!element) return;
		const update = () => document.documentElement.style.setProperty("--header-height", `${Math.ceil(element.getBoundingClientRect().height)}px`);
		const observer = new ResizeObserver(update);
		observer.observe(element);
		update();
		return () => {
			observer.disconnect();
			document.documentElement.style.removeProperty("--header-height");
		};
	}, []);
	useEffect(() => {
		if (!open) return;
		panel.current?.querySelector("a")?.focus();
		function keydown(event) {
			if (event.key === "Escape") {
				setOpen(false);
				toggle.current?.focus();
			}
		}
		function outside(event) {
			if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false);
		}
		const desktop = matchMedia("(min-width: 1024px)");
		const resize = () => {
			if (desktop.matches) setOpen(false);
		};
		document.addEventListener("keydown", keydown);
		document.addEventListener("pointerdown", outside);
		document.addEventListener("focusin", outside);
		desktop.addEventListener("change", resize);
		return () => {
			document.removeEventListener("keydown", keydown);
			document.removeEventListener("pointerdown", outside);
			document.removeEventListener("focusin", outside);
			desktop.removeEventListener("change", resize);
		};
	}, [open]);
	function followLink() {
		setOpen(false);
	}
	return <header className="site-header" ref={header}>
      <Container className="header-inner">
        <a href="/#home" className="brand" aria-label="EduConnect home" onClick={followLink}>
          <img src="/brand/educonnect-logo.png" alt="EduConnect" width={330} height={137} fetchPriority="high" />
        </a>
        <nav className="desktop-navigation" aria-label="Main navigation">
          {navigation.map((item) => <a key={item.href} href={item.href}>
              {item.label}
            </a>)}
        </nav>
        <div className="header-actions">
          <a href={schoolApp.login} className="header-login">Log in</a>
          <ButtonLink href={schoolApp.register} className="header-cta" onClick={followLink}>
            Get Started
          </ButtonLink>
          <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen((value) => !value)}>
            {open ? <X size={23} aria-hidden="true" /> : <Menu size={23} aria-hidden="true" />}
          </button>
        </div>
      </Container>
      <nav ref={panel} id="mobile-navigation" className="mobile-navigation" hidden={!open} aria-label="Mobile navigation">
        <Container>
          {navigation.map((item) => <a key={item.href} href={item.href} onClick={followLink}>
              {item.label}
            </a>)}
          <a href={schoolApp.login} onClick={followLink}>Log in</a>
          <ButtonLink href={schoolApp.register} onClick={followLink}>
            Get Started
          </ButtonLink>
        </Container>
      </nav>
    </header>;
}
