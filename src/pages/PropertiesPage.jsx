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
        subtitle="This page is structured to later support live listings, valued pricing, and detailed property pages for each property."
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
