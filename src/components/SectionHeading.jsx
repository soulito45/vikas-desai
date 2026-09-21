export default function SectionHeading({ eyebrow, title, subtitle, align = 'left' }) {
  return (
    <div className={`section-heading ${align}`}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  )
}
