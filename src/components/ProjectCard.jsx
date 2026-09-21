import { ArrowRight, MapPin, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  return (
    <article className="card project-card">
      <img src={project.image} alt={project.name} loading="lazy" />
      <div className="card-body">
        <div className="meta-row">
          <span className="pill">{project.status}</span>
        </div>
        <h3>{project.name}</h3>
        <div className="info-row"><MapPin size={16} /> {project.location}</div>
        <div className="info-row"><Tag size={16} /> {project.configuration}</div>
        <div className="price-line">Starting from {project.startingPrice}</div>
        <Link to={`/projects/${project.slug}`} className="text-link">
          View project <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  )
}
