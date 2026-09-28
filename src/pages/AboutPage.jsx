import { CheckCircle2 } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import CTASection from '../components/CTASection'
import PageShell from './PageShell'
import vikasPortrait from '../assets/vikas.png'

export default function AboutPage() {
  return (
    <PageShell
      title="About Vikas U Desai | Real Estate Consultant in Mira Road East"
      description="Learn about Vikas U Desai, a local property and finance consultancy with 18+ years of experience in Mira Road East and nearby areas."
    >
      <main className="page-shell container">
      <SectionHeading
        eyebrow="About"
        title="Local knowledge. Thoughtful guidance. Better decisions."
        subtitle="With 18+ years in real estate and finance consultancy, Vikas U Desai helps clients make clear, well-informed property decisions in Mira Road East and nearby areas."
      />

      <section className="about-layout">
        <div className="card founder-card">
          <img
            src={vikasPortrait}
            alt="Vikas Desai"
          />
          <div className="founder-copy">
            <span className="eyebrow">Founder</span>
            <h3>Vikas Desai</h3>
            <p>With over 18 years in the local market, Vikas helps clients assess opportunities, understand next steps, and make confident property decisions.</p>
          </div>
        </div>

        <div className="card founder-card">
          <img
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80"
            alt="Divyesh Desai"
          />
          <div className="founder-copy">
            <span className="eyebrow">Founder</span>
            <h3>Divyesh Desai</h3>
            <p>Divyesh guides clients through property transactions and finance planning, with advice tailored to their goals and circumstances.</p>
          </div>
        </div>
      </section>

      <section className="card about-copy">
        <span className="eyebrow">Our approach</span>
        <h3>Built on local knowledge. Guided by personal service.</h3>
        <p>
          As a family-run consultancy, Vikas U Desai Real Estate & Finance Consultancy brings together local understanding and hands-on support for property and finance decisions. Every conversation is focused on clear information and practical next steps.
        </p>
        <ul className="check-list">
          <li><CheckCircle2 size={18} aria-hidden="true" /><span>18+ years of real estate and finance experience</span></li>
          <li><CheckCircle2 size={18} aria-hidden="true" /><span>Local guidance across Mira Road East and nearby areas</span></li>
          <li><CheckCircle2 size={18} aria-hidden="true" /><span>Residential and commercial property advice</span></li>
          <li><CheckCircle2 size={18} aria-hidden="true" /><span>Resale and new-project assistance</span></li>
          <li><CheckCircle2 size={18} aria-hidden="true" /><span>Finance and home-loan guidance</span></li>
          <li><CheckCircle2 size={18} aria-hidden="true" /><span>Recommendations shaped around your budget and priorities</span></li>
        </ul>
      </section>

      <CTASection
        title="Need a second opinion on a property decision?"
        text="Speak with the consultancy for practical guidance around buying, selling, financing, and local property expectations."
        primaryLabel="Call now"
        primaryTo="tel:09920133345"
      />
      </main>
    </PageShell>
  )
}
