import { PublicLayout } from "@/components/marketing/layout/public-layout";
import { HeroSection } from "@/components/marketing/landing/hero-section";
import { BenefitsSection } from "@/components/marketing/landing/benefits-section";
import { ProductShowcase } from "@/components/marketing/landing/product-showcase";
import { HowItWorks } from "@/components/marketing/landing/how-it-works";
import { FaqSection } from "@/components/marketing/landing/faq-section";
import { ContactSection } from "@/components/marketing/landing/contact-section";
import { FaqMotion } from "@/components/marketing/ui/faq-motion";
import { ScrollReveals } from "@/components/marketing/ui/scroll-reveals";

export function Home() {
  return <PublicLayout title="Connected School Management">
    <HeroSection />
    <BenefitsSection />
    <ProductShowcase />
    <HowItWorks />
    <FaqSection />
    <ContactSection />
    <ScrollReveals />
    <FaqMotion />
  </PublicLayout>;
}
