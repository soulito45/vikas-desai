import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CTASection({
  title,
  text,
  primaryLabel = 'Contact Us',
  primaryTo = '/contact',
  secondaryLabel,
  secondaryTo,
}) {
  const renderLink = (label, destination, className, includeArrow = true) => {
    const isExternal = /^(https?:|tel:|mailto:)/i.test(destination)
    const content = <>{label}{includeArrow && <> <ArrowRight size={16} /></>}</>
    return isExternal
      ? <a href={destination} className={className} target={destination.startsWith('https:') ? '_blank' : undefined} rel={destination.startsWith('https:') ? 'noreferrer' : undefined}>{content}</a>
      : <Link to={destination} className={className}>{content}</Link>
  }

  return (
    <section className="cta-section">
      <div className="container cta-shell card">
        <div>
          <span className="eyebrow">Need guidance?</span>
          <h2>{title}</h2>
        </div>
        <p>{text}</p>
        <div className="cta-actions">
          {renderLink(primaryLabel, primaryTo, 'primary-button')}
          {secondaryLabel && secondaryTo ? (
            renderLink(secondaryLabel, secondaryTo, 'secondary-button', false)
          ) : null}
        </div>
      </div>
    </section>
  )
}
