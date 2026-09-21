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
  return (
    <section className="cta-section">
      <div className="container cta-shell card">
        <div>
          <span className="eyebrow">Need guidance?</span>
          <h2>{title}</h2>
        </div>
        <p>{text}</p>
        <div className="cta-actions">
          <Link to={primaryTo} className="primary-button">
            {primaryLabel} <ArrowRight size={16} />
          </Link>
          {secondaryLabel && secondaryTo ? (
            <Link to={secondaryTo} className="secondary-button">
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}
