import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero({
  title,
  subtitle,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
  backgroundImage,
  sceneLabel,
}) {
  const heroRef = useRef(null)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let frame = 0
    const updateProgress = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect()
        const travel = Math.max(1, bounds.height - window.innerHeight)
        const progress = Math.max(0, Math.min(1, -bounds.top / travel))
        hero.style.setProperty('--hero-scroll-progress', progress.toFixed(4))
      })
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <section className="hero-section" ref={heroRef}>
      <div className="hero-stage">
        <div className="hero-photo-scene" aria-hidden="true">
          <img src={backgroundImage} alt="" fetchPriority="high" />
        </div>
        <div className="container hero-content">
          <div className="hero-copy">
            <span className="eyebrow light">Mira Road · Property guidance</span>
            <h1 className="hero-title">{title}</h1>
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
          </div>
        </div>
        {sceneLabel && <div className="hero-scene-label" aria-hidden="true">{sceneLabel}</div>}
        <div className="hero-scroll-cue" aria-hidden="true"><ArrowDown size={15} /> Scroll to explore</div>
      </div>
    </section>
  )
}
