import { Container } from "@/components/marketing/ui/container";
import { SectionHeading } from "@/components/marketing/ui/section-heading";
const benefits = [
	{
		title: "Simpler administration",
		description: "Keep daily tasks and school records organised."
	},
	{
		title: "Better communication",
		description: "Share important updates with teachers and families."
	},
	{
		title: "Clearer progress",
		description: "See attendance, results and where support is needed."
	}
];
export function BenefitsSection() {
	return <section id="benefits" className="section benefits" aria-labelledby="benefits-title">
      <Container className="benefits-layout">
        <SectionHeading title={<>
              Less admin.
              <span className="benefits-heading-line">More time for teaching.</span>
            </>} id="benefits-title" />
        <div className="benefit-grid">
          {benefits.map(({ title, description }) => <article className="benefit-card" key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>)}
        </div>
      </Container>
    </section>;
}
