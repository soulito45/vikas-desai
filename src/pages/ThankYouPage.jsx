import { CheckCircle2, MessageCircleMore, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageShell from './PageShell'

export default function ThankYouPage() {
  return (
    <PageShell title="Thank You | Vikas U Desai" description="Thank you for contacting Vikas U Desai Real Estate & Finance Consultancy.">
      <main className="page-shell container">
        <div className="card success-page">
          <CheckCircle2 size={54} aria-hidden="true" />
          <span className="eyebrow">Thank you</span>
          <h1>Your enquiry has been received.</h1>
          <p>The consultancy will review your message and contact you shortly using the details provided.</p>
          <div className="contact-action-row">
            <a href="tel:09920133345" className="primary-button"><Phone size={16} /> Call 099201 33345</a>
            <a href="https://wa.me/919920133345" target="_blank" rel="noreferrer" className="secondary-button"><MessageCircleMore size={16} /> WhatsApp</a>
          </div>
          <Link to="/" className="text-link">Return to the website</Link>
        </div>
      </main>
    </PageShell>
  )
}
