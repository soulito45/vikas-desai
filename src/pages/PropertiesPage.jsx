import PropertyCard from '../components/PropertyCard'
import SectionHeading from '../components/SectionHeading'
import PropertySearch from '../components/PropertySearch'
import { useContent } from '../context/ContentContext'

export default function PropertiesPage() {
  const { properties } = useContent()
  return (
    <main className="page-shell container">
      <SectionHeading
        eyebrow="Properties"
        title="Property opportunities for buyers, sellers and investors."
        subtitle="Explore selected residential and commercial opportunities across Mira Road East and nearby communities. Contact the consultancy to confirm availability and arrange a viewing."
      />

      <PropertySearch />

      <div className="card-grid three-col properties-grid">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </main>
  )
}
