import SectionHeading from '../components/SectionHeading'
import ServiceCard from '../components/ServiceCard'
import CTASection from '../components/CTASection'
import { services } from '../data/services'

export default function ServicesPage() {
  return (
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
  )
}
