import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero({
  title,
  subtitle,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
  backgroundImage,
  badges = [],
}) {
  return (
    <section className="hero-section" style={{ backgroundImage: `linear-gradient(rgba(19,21,24,0.46), rgba(19,21,24,0.65)), url(${backgroundImage})` }}>
      <div className="container hero-content">
        <div className="hero-copy">
          <span className="eyebrow light">Premium local guidance</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <div className="hero-actions">
            {primaryTo ? (
              <Link to={primaryTo} className="primary-button">
                {primaryLabel} <ArrowRight size={16} />
              </Link>
            ) : null}
            {secondaryTo ? (
              <a href={secondaryTo} target="_blank" rel="noreferrer" className="secondary-button">
                {secondaryLabel}
              </a>
            ) : null}
          </div>
          <div className="badge-row">
            {badges.map((badge) => (
              <span key={badge} className="hero-badge">{badge}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
