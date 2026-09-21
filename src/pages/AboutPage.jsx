import SectionHeading from '../components/SectionHeading'
import CTASection from '../components/CTASection'
import PageShell from './PageShell'

export default function AboutPage() {
  return (
    <PageShell
      title="About Vikas U Desai | Real Estate Consultant in Mira Road East"
      description="Learn about Vikas U Desai, a local property and finance consultancy with 18+ years of experience in Mira Road East and nearby areas."
    >
      <main className="page-shell container">
      <SectionHeading
        eyebrow="About"
        title="Local property and finance guidance built on experience."
        subtitle="Vikas U Desai brings 18+ years of hands-on work in real estate and finance consultancy in Mira Road East, helping clients with practical property decisions and financing support."
      />

      <section className="about-layout">
        <div className="card profile-card large">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
            alt="Owner portrait placeholder"
          />
        </div>
        <div className="card about-copy">
          <h3>Professional guidance with a local understanding</h3>
          <p>
            The consultancy supports residential and commercial buyers and sellers, as well as those seeking targeted real estate consultation in the Mira Road East and nearby areas.
          </p>
          <ul className="check-list">
            <li>18+ years of experience in real estate and finance consultancy</li>
            <li>Local market knowledge specific to Mira Road East and surrounding localities</li>
            <li>Residential and commercial property guidance</li>
            <li>Resale assistance and new project assistance</li>
            <li>Finance and home-loan consultation</li>
            <li>Personalised support based on the client’s budget and requirement</li>
          </ul>
        </div>
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
