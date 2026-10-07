import { ArrowRight, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import PropertyCard from '../components/PropertyCard'
import CTASection from '../components/CTASection'
import PageShell from './PageShell'
import { businessRating } from '../data/reviews'
import { useContent } from '../context/ContentContext'
import vikasPortrait from '../assets/vikas.png'

export default function HomePage() {
  const { properties } = useContent()
  return (
    <PageShell
      title="Vikas U Desai Real Estate & Finance Consultancy | Mira Road East"
      description="Trusted property and finance guidance in Mira Road East with 18+ years of local experience. Residential, commercial, resale, and home-loan assistance."
    >
      <>
      <Hero
        title={<>Find What<br />Moves You</>}
        subtitle="Local homes. Real guidance. A clearer way forward."
        primaryLabel="Explore Properties"
        primaryTo="/properties"
        backgroundImage="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=2200&q=90"
        sceneLabel="MIRA ROAD"
      />

      <div className="home-search-entry">
        <Link to="/properties" className="home-search-link">
          <span className="home-search-icon"><Search size={20} /></span>
          <span><small>Begin your search</small><strong>Find a home in Mira Road</strong></span>
          <span className="home-search-arrow"><ArrowRight size={20} /></span>
        </Link>
      </div>

      <main>
        <section className="home-listings-section">
          <div className="container">
            <div className="home-listings-heading">
              <div>
                <span className="eyebrow">A few places to begin</span>
                <h2>Considered homes.<br />Closer to what matters.</h2>
              </div>
              <Link to="/properties" className="home-see-all">View all properties <ArrowRight size={17} /></Link>
            </div>
          <div className="card-grid three-col">
            {properties.slice(0, 3).map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
          </div>
        </section>

        <section className="home-story-section">
          <div className="container home-story-grid">
            <div className="home-story-image"><img src={vikasPortrait} alt="Vikas Desai, local real estate consultant" loading="lazy" /></div>
            <div className="home-story-copy">
              <span className="eyebrow">A more personal kind of property guidance</span>
              <h2>Local knowledge.<br />A clearer next step.</h2>
              <p>For over 18 years, Vikas U Desai has helped people find their way through property decisions around Mira Road.</p>
              <Link to="/about" className="home-see-all">Meet your local consultant <ArrowRight size={17} /></Link>
              <div className="home-review-note"><strong>{businessRating.value}</strong><span>{businessRating.note}</span></div>
            </div>
          </div>
        </section>
      </main>

      <CTASection
        title="Your next move starts here."
        text="Tell us what home means to you. We’ll help you find a way forward."
        primaryLabel="Talk to us"
        primaryTo="/contact"
        secondaryLabel="View projects"
        secondaryTo="/projects"
      />
      </>
    </PageShell>
  )
}
