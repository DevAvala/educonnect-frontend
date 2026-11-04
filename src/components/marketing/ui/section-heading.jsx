export function SectionHeading({ eyebrow, title, children, centered = false, id }) {
	return <div className={`section-heading ${centered ? "section-heading--center" : ""}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id}>{title}</h2>
      {children && <p className="section-description">{children}</p>}
    </div>;
}
