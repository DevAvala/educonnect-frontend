import { Container } from "@/components/marketing/ui/container";
import { ButtonLink } from "@/components/marketing/ui/button";
export function HeroSection() {
	return <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero-background" aria-hidden="true">
        <img src="/images/family-learning.webp" alt="" className="cover-image" fetchPriority="high" sizes="100vw" />
        <div className="hero-overlay" />
      </div>
      <Container className="hero-container">
        <div className="hero-copy">
          <h1 id="hero-title">A simpler way to run your school.</h1>
          <p className="hero-description">
            Keep records organised, teachers supported and parents informed.
          </p>
          <div className="hero-actions">
            <ButtonLink href="#contact">Get Started</ButtonLink>
          </div>
        </div>
      </Container>
    </section>;
}
