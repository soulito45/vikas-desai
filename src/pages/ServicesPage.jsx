import SectionHeading from '../components/SectionHeading'
import ServiceCard from '../components/ServiceCard'
import CTASection from '../components/CTASection'
import { useContent } from '../context/ContentContext'
import PageShell from './PageShell'

export default function ServicesPage() {
  const { services } = useContent()
  return (
    <PageShell title="Property & Finance Services | Vikas U Desai" description="Property consultation, resale guidance, project support, commercial advice, financing, and investment support in Mira Road East.">
      <main className="page-shell container">
      <SectionHeading
        eyebrow="Services"
        title="Consultancy support across every step of your property journey."
        subtitle="From finding the right property to understanding finance options, the focus remains on practical, relevant support."
      />

      <div className="card-grid three-col">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      <CTASection
        title="Need property guidance?"
        text="Discuss your requirement, budget, and preferred area with the consultancy for a more focused recommendation."
        primaryLabel="Book a consultation"
        primaryTo="/contact"
      />
      </main>
    </PageShell>
  )
}
