import { MapPin, Phone, CalendarRange, Building, Ruler, BedDouble, CarFront, Home, MessageCircleMore, ArrowRight } from 'lucide-react'
import { useParams } from 'react-router-dom'
import ImageGallery from '../components/ImageGallery'
import CTASection from '../components/CTASection'
import { useContent } from '../context/ContentContext'
import PageShell from './PageShell'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const { properties } = useContent()
  const property = properties.find((item) => item.id === id) || properties[0]
  const propertySchema = {
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    address: { '@type': 'PostalAddress', addressLocality: property.location, addressRegion: 'Maharashtra', addressCountry: 'IN' },
    offers: { '@type': 'Offer', price: Number((Number(property.price.match(/[\d.]+/)?.[0] || 0) * (property.price.toLowerCase().includes('cr') ? 10000000 : 100000)).toFixed(0)), priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
  }

  return (
    <PageShell
      title={`${property.title} | Vikas U Desai`}
      description={`${property.title} details, location, pricing, configuration, and availability in ${property.location}.`}
      schema={propertySchema}
    >
      <main className="page-shell container property-detail-page">
      <section className="detail-hero card">
        <div className="detail-media">
          <img src={property.image} alt={property.title} />
        </div>
        <div className="detail-copy">
          <span className="pill">{property.status}</span>
          <h1>{property.title}</h1>
          <div className="info-row"><MapPin size={16} /> {property.location}</div>
          <div className="price-line">{property.price}</div>
          <div className="detail-meta-grid">
            <div><BedDouble size={15} /> {property.configuration}</div>
            <div><Ruler size={15} /> {property.carpetArea}</div>
            <div><Building size={15} /> Floor {property.floor}</div>
            <div><CarFront size={15} /> {property.parking}</div>
            <div><Home size={15} /> {property.furnishing}</div>
            <div><CalendarRange size={15} /> {property.propertyAge}</div>
          </div>
          <div className="cta-actions split-actions">
            <a href="https://wa.me/919920133345?text=Hello%2C%20I%20am%20interested%20in%20this%20property.%20Please%20share%20more%20details." target="_blank" rel="noreferrer" className="primary-button">
              <MessageCircleMore size={16} /> WhatsApp
            </a>
            <a href="tel:09920133345" className="secondary-button">
              <Phone size={16} /> Call us
            </a>
            <a href="/contact" className="secondary-button">
              Schedule Visit <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <section className="detail-section">
        <h2>Property overview</h2>
        <p>{property.description}</p>
      </section>

      <section className="detail-section">
        <h2>Details</h2>
        <div className="details-grid">
          <div className="card"><strong>Location</strong><span>{property.location}</span></div>
          <div className="card"><strong>Price</strong><span>{property.price}</span></div>
          <div className="card"><strong>Configuration</strong><span>{property.configuration}</span></div>
          <div className="card"><strong>Carpet area</strong><span>{property.carpetArea}</span></div>
          <div className="card"><strong>Floor</strong><span>{property.floor}</span></div>
          <div className="card"><strong>Total floors</strong><span>{property.totalFloors}</span></div>
          <div className="card"><strong>Parking</strong><span>{property.parking}</span></div>
          <div className="card"><strong>Furnishing</strong><span>{property.furnishing}</span></div>
          <div className="card"><strong>Property age</strong><span>{property.propertyAge}</span></div>
        </div>
      </section>

      <section className="detail-section">
        <h2>Gallery</h2>
        <ImageGallery images={property.gallery} altPrefix={property.title} />
      </section>

      <section className="detail-section">
        <h2>Location</h2>
        <div className="map-card card">
          <iframe
            title={`Map for ${property.title}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <CTASection
        title="Interested in this property?"
        text="Connect with the consultancy to learn more, arrange a visit, or discuss financing options for your next move."
        primaryLabel="WhatsApp now"
        primaryTo="https://wa.me/919920133345"
      />
      </main>
    </PageShell>
  )
}
