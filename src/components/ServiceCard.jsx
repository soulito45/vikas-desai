import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ServiceCard({ service }) {
  const Icon = service.icon

  return (
    <article className="card service-card">
      <div className="service-icon"><Icon size={24} /></div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <Link to={service.link} className="text-link">
        Learn more <ArrowRight size={16} />
      </Link>
    </article>
  )
}
