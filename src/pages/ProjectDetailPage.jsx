import { Building, CalendarRange, CheckCircle2, MapPin, MessageCircleMore, Phone } from 'lucide-react'
import { useParams } from 'react-router-dom'
import ImageGallery from '../components/ImageGallery'
import CTASection from '../components/CTASection'
import { useContent } from '../context/ContentContext'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { projects } = useContent()
  const project = projects.find((item) => item.id === id) || projects[0]

  return (
    <main className="page-shell container project-detail-page">
      <section className="detail-hero card project-hero">
        <div className="detail-media">
          <img src={project.image} alt={project.name} />
        </div>
        <div className="detail-copy">
          <span className="pill">{project.status}</span>
          <h1>{project.name}</h1>
          <div className="info-row"><MapPin size={16} /> {project.location}</div>
          <div className="price-line">Starting from {project.startingPrice}</div>
          <div className="detail-meta-grid">
            <div><Building size={15} /> {project.configuration}</div>
            <div><CalendarRange size={15} /> {project.possession}</div>
          </div>
          <div className="cta-actions split-actions">
            <a href={`https://wa.me/919920133345?text=${encodeURIComponent(`Hello, I am interested in ${project.name}. Please share more details.`)}`} target="_blank" rel="noreferrer" className="primary-button">
              <MessageCircleMore size={16} /> WhatsApp
            </a>
            <a href="tel:09920133345" className="secondary-button">
              <Phone size={16} /> Call us
            </a>
          </div>
        </div>
      </section>

      <section className="detail-section">
        <h2>Project overview</h2>
        <p>{project.overview}</p>
      </section>

      <section className="detail-section">
        <h2>Project details</h2>
        <div className="details-grid compact-grid">
          <div className="card"><strong>Developer</strong><span>{project.developer}</span></div>
          <div className="card"><strong>Location</strong><span>{project.location}</span></div>
          <div className="card"><strong>Status</strong><span>{project.status}</span></div>
          <div className="card"><strong>Possession</strong><span>{project.possession}</span></div>
          <div className="card"><strong>Configurations</strong><span>{project.configuration}</span></div>
          <div className="card"><strong>Starting price</strong><span>{project.startingPrice}</span></div>
        </div>
      </section>

      <section className="detail-section">
        <h2>Highlights</h2>
        <ul className="check-list">
          {project.highlights.map((item) => (
            <li key={item}><CheckCircle2 size={18} /> {item}</li>
          ))}
        </ul>
      </section>

      <section className="detail-section">
        <h2>Amenities</h2>
        <ul className="check-list two-column-list">
          {project.amenities.map((item) => (
            <li key={item}><CheckCircle2 size={18} /> {item}</li>
          ))}
        </ul>
      </section>

      <section className="detail-section">
        <h2>Configuration details</h2>
        <div className="config-grid">
          {project.configurations.map((config) => (
            <div key={config.type} className="card config-card">
              <h3>{config.type}</h3>
              <p>{config.size}</p>
              <strong>{config.price}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <h2>Gallery</h2>
        <ImageGallery images={project.gallery} altPrefix={project.name} />
      </section>

      <section className="detail-section">
        <h2>Location / map</h2>
        <div className="map-placeholder card">Map placeholder — add a Google Maps embed or location pin later.</div>
      </section>

      <section className="detail-section">
        <h2>FAQ</h2>
        <div className="faq-list">
          {project.faq.map((item) => (
            <div key={item.question} className="card faq-item">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <CTASection
        title={`Interested in ${project.name}?`}
        text="Ask for availability, brochure details, and a personalised consultation around this property opportunity."
        primaryLabel="Enquire now"
        primaryTo="/contact"
        secondaryLabel="Call us"
        secondaryTo="tel:09920133345"
      />
    </main>
  )
}
