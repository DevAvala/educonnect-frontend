import { Container } from "@/components/marketing/ui/container";
import { SectionHeading } from "@/components/marketing/ui/section-heading";
const steps = [
	{
		title: "Tell us what you need",
		description: "Share your school’s priorities."
	},
	{
		title: "Plan your setup",
		description: "Choose your tools and onboarding plan."
	},
	{
		title: "Bring your team on board",
		description: "Get ready to work together."
	}
];
export function HowItWorks() {
	return <section id="how-it-works" className="section how-section" aria-labelledby="how-title">
      <Container>
        <div className="how-intro">
          <SectionHeading title="Getting started is simple." id="how-title" />
        </div>
        <ol className="steps">
          {steps.map((step, i) => <li key={step.title}>
              <span className="step-number">0{i + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>)}
        </ol>
      </Container>
    </section>;
}
