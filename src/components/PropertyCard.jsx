import { ArrowRight, BedDouble, MapPin, Ruler } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PropertyCard({ property }) {
  return (
    <article className="card property-card">
      <img src={property.image} alt={property.title} loading="lazy" />
      <div className="card-body">
        <span className="pill">{property.status}</span>
        <h3>{property.title}</h3>
        <div className="info-row"><MapPin size={16} /> {property.location}</div>
        <div className="property-stats">
          <span><BedDouble size={15} /> {property.configuration}</span>
          <span><Ruler size={15} /> {property.carpetArea}</span>
        </div>
        <div className="price-line">{property.price}</div>
        <Link to={`/properties/${property.id}`} className="text-link">
          View details <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  )
}
