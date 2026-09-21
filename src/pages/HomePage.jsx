import { BadgeCheck, Building2, Building, Home, Landmark, MapPinned, PhoneCall } from 'lucide-react'
import Hero from '../components/Hero'
import PropertySearch from '../components/PropertySearch'
import SectionHeading from '../components/SectionHeading'
import ProjectCard from '../components/ProjectCard'
import PropertyCard from '../components/PropertyCard'
import ServiceCard from '../components/ServiceCard'
import ReviewCard from '../components/ReviewCard'
import AreaCard from '../components/AreaCard'
import CTASection from '../components/CTASection'
import PageShell from './PageShell'
import { businessRating } from '../data/reviews'
import { areas } from '../data/areas'
import { useContent } from '../context/ContentContext'

const trustPoints = [
  '18+ Years Local Experience',
  'Personalized Property Consultation',
  'Residential & Commercial Expertise',
  'New Projects & Resale Properties',
  'Property + Finance Assistance',
  'Local Market Knowledge',
]

export default function HomePage() {
  const { projects, properties, services, reviews } = useContent()
  return (
    <PageShell
      title="Vikas U Desai Real Estate & Finance Consultancy | Mira Road East"
      description="Trusted property and finance guidance in Mira Road East with 18+ years of local experience. Residential, commercial, resale, and home-loan assistance."
    >
      <>
      <Hero
        title="Find the Right Property. With the Right Guidance."
        subtitle="Vikas U Desai Real Estate & Finance Consultancy — trusted property and finance guidance in Mira Road East with 18+ years of local experience."
        primaryLabel="Explore Properties"
        primaryTo="/properties"
        secondaryLabel="WhatsApp Us"
        secondaryTo="https://wa.me/919920133345"
        backgroundImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80"
        badges={[
          '18+ Years Experience',
          'Residential & Commercial',
          'New Projects & Resale',
          'Property + Finance Consultancy',
        ]}
      />

      <PropertySearch />

      <main>
        <section className="section container">
          <SectionHeading
            eyebrow="Featured projects"
            title="Sample project opportunities for future listings"
            subtitle="These cards are intentionally placeholder-based so real projects can be added without redesigning the layout."
          />
          <div className="card-grid three-col">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <section className="section section-soft">
          <div className="container">
            <div className="split-layout">
              <div>
                <SectionHeading
                  eyebrow="About the consultancy"
                  title="Guidance rooted in local experience and practical understanding."
                  subtitle="Vikas U Desai brings 18+ years of real estate and finance consultancy experience in Mira Road East, helping clients across residential, commercial, resale, and financing decisions."
                />
                <div className="profile-box card">
                  <div className="profile-image">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
                      alt="Professional portrait placeholder"
                    />
                  </div>
                  <ul className="check-list">
                    <li><BadgeCheck size={18} /> 18+ years in local real estate and finance consultancy</li>
                    <li><BadgeCheck size={18} /> Residential and commercial property guidance</li>
                    <li><BadgeCheck size={18} /> Resale and new project assistance</li>
                    <li><BadgeCheck size={18} /> Finance and home-loan support</li>
                    <li><BadgeCheck size={18} /> Personal consultation with a local perspective</li>
                  </ul>
                </div>
              </div>

              <div className="highlights-card card">
                <div className="highlight-title">
                  <Building2 size={18} />
                  <span>Why local buyers choose this consultancy</span>
                </div>
                <ul className="feature-list">
                  {trustPoints.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section container">
          <SectionHeading
            eyebrow="Services"
            title="Property and finance support designed around your goals."
          />
          <div className="card-grid three-col">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        <section className="section section-soft">
          <div className="container">
            <SectionHeading
              eyebrow="Our promise"
              title="Why clients trust local guidance."
            />
            <div className="grid-2 trust-grid">
              <div className="trust-item card">
                <Home size={22} />
                <h3>18+ Years Local Experience</h3>
              </div>
              <div className="trust-item card">
                <Building size={22} />
                <h3>Personalized Property Consultation</h3>
              </div>
              <div className="trust-item card">
                <MapPinned size={22} />
                <h3>Residential & Commercial Expertise</h3>
              </div>
              <div className="trust-item card">
                <Landmark size={22} />
                <h3>New Projects & Resale Properties</h3>
              </div>
              <div className="trust-item card">
                <PhoneCall size={22} />
                <h3>Property + Finance Assistance</h3>
              </div>
              <div className="trust-item card">
                <BadgeCheck size={22} />
                <h3>Local Market Knowledge</h3>
              </div>
            </div>
          </div>
        </section>

        <section className="section container">
          <SectionHeading
            eyebrow="Reviews"
            title="What people appreciate about the service."
          />
          <div className="rating-summary card">
            <div>
              <span className="rating-value">{businessRating.value}</span>
              <p>{businessRating.note}</p>
            </div>
          </div>
          <div className="card-grid three-col">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>

        <section className="section container">
          <SectionHeading
            eyebrow="Areas we serve"
            title="Local expertise across the nearby property market."
          />
          <div className="card-grid four-col">
            {areas.map((area) => (
              <AreaCard key={area.id} area={area} />
            ))}
          </div>
        </section>

        <section className="section container">
          <SectionHeading
            eyebrow="Featured properties"
            title="A few representation listings to show the property experience layout."
          />
          <div className="card-grid three-col">
            {properties.map((property) => (
              <div key={property.id}>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <CTASection
        title="Ready to discuss your next move?"
        text="Whether you are buying, selling, investing, or looking for finance advice, the consultancy can guide you with local insight and practical support."
        primaryLabel="Contact the consultancy"
        primaryTo="/contact"
        secondaryLabel="View projects"
        secondaryTo="/projects"
      />
      </>
    </PageShell>
  )
}
