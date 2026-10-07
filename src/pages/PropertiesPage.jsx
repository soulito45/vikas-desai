import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard'
import SectionHeading from '../components/SectionHeading'
import PropertySearch from '../components/PropertySearch'
import { useContent } from '../context/ContentContext'
import { filterProperties } from '../utils/propertyFilters'
import PageShell from './PageShell'

export default function PropertiesPage() {
  const { properties } = useContent()
  const [searchParams] = useSearchParams()
  const filteredProperties = useMemo(() => filterProperties(properties, Object.fromEntries(searchParams)), [properties, searchParams])

  return (
    <PageShell title="Properties in Mira Road East | Vikas U Desai" description="Explore residential, commercial, resale, and investment property opportunities across Mira Road East and nearby areas.">
      <main className="page-shell container">
      <SectionHeading eyebrow="Properties" title="Property opportunities for buyers, sellers and investors." subtitle="Explore selected residential and commercial opportunities across Mira Road East and nearby communities. Contact the consultancy to confirm availability and arrange a viewing." />
      <PropertySearch />
      <div className="results-summary"><span>{filteredProperties.length} properties found</span>{searchParams.size > 0 && <Link to="/properties">Clear filters</Link>}</div>
      <div className="card-grid three-col properties-grid">
        {filteredProperties.map((property) => <PropertyCard key={property.id} property={property} />)}
      </div>
      {filteredProperties.length === 0 && <div className="empty-state card"><h3>No matching properties</h3><p>Try changing the filters or contact the consultancy for available options.</p></div>}
      <nav className="detail-section" aria-label="Related property guidance">
        <h2>More property guidance</h2>
        <p><Link to="/projects">Explore new projects</Link> · <Link to="/services">View property services</Link> · <Link to="/blog">Read buyer guides</Link> · <Link to="/contact">Ask for a consultation</Link></p>
      </nav>
      </main>
    </PageShell>
  )
}
