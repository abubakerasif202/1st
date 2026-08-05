export function SectionHeading({ eyebrow, title, intro, align = 'left' }) {
  return <div className={`section-heading ${align === 'center' ? 'text-center' : ''}`}>
    <p className="eyebrow">{eyebrow}</p>
    <h2>{title}</h2>
    {intro && <p>{intro}</p>}
  </div>
}
