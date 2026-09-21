import { Clock3, MessageCircleMore, Phone } from 'lucide-react'
import ContactCard from '../components/ContactCard'
import EnquiryForm from '../components/EnquiryForm'
import SectionHeading from '../components/SectionHeading'
import PageShell from './PageShell'

export default function ContactPage() {
  return (
    <PageShell
      title="Contact Vikas U Desai | Property Consultation in Mira Road East"
      description="Get in touch with Vikas U Desai Real Estate & Finance Consultancy for property guidance, finance support, and consultation in Mira Road East."
    >
      <main className="page-shell container">
      <SectionHeading
        eyebrow="Contact"
        title="Speak with the consultancy about your next property move."
        subtitle="Whether you are buying, selling, investing or looking for finance guidance, share your requirement and the team will guide you accordingly."
      />

      <div className="contact-layout">
        <div className="contact-stack">
          <ContactCard />
          <div className="card business-hours">
            <h3>Business hours</h3>
            <ul>
              <li><Clock3 size={16} /> Monday to Saturday</li>
              <li><Clock3 size={16} /> By appointment</li>
            </ul>
          </div>
          <div className="card map-card">
            <h3>Location</h3>
            <div className="map-placeholder">Google Maps placeholder - add embed later.</div>
          </div>
        </div>

        <EnquiryForm />
      </div>

      <div className="contact-action-row">
        <a href="tel:09920133345" className="primary-button"><Phone size={16} /> Call 099201 33345</a>
        <a href="https://wa.me/919920133345" target="_blank" rel="noreferrer" className="secondary-button"><MessageCircleMore size={16} /> WhatsApp</a>
      </div>
      </main>
    </PageShell>
  )
}
