import { ArrowUpRight } from "lucide-react";
import { FaFacebookF, FaXTwitter, FaLinkedinIn, FaTiktok } from "react-icons/fa6";
import { company, legalLinks, navigation, socialLinks } from "@/content/marketing/site";
import { Container } from "@/components/marketing/ui/container";
const socialLogos = { Facebook: FaFacebookF, X: FaXTwitter, LinkedIn: FaLinkedinIn, TikTok: FaTiktok };
export function Footer() {
	return <footer className="site-footer">
      <Container>
        <div className="footer-top">
          <div className="footer-brand">
            <a href="/#home" aria-label="EduConnect home" className="footer-logo">
              <img src="/brand/educonnect-logo.png" alt="EduConnect" width={330} height={137} />
            </a>
            <p>
              Connecting school operations and communities.
            </p>
            <nav className="social-links" aria-label="Social media">
              {socialLinks.map((link) => {
                const Logo = socialLogos[link.label];
                return <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="w-11 justify-center" title={link.label} aria-label={`EduConnect on ${link.label} (opens in new tab)`}>
                  <Logo size={22} aria-hidden="true" focusable="false" />
                </a>;
              })}
            </nav>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            <h2>Explore</h2>
            <a href="/contact">Contact us</a>
            {navigation.slice(1).map((link) => <a key={link.href} href={link.href}>
                {link.label}
              </a>)}
          </nav>
          <nav className="footer-nav" aria-label="Legal policies">
            <h2>Legal</h2>
            {legalLinks.map((link) => <a key={link.href} href={link.href}>
                {link.label}
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>)}
          </nav>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <a href="/#home">Back to top ↑</a>
        </div>
      </Container>
    </footer>;
}
