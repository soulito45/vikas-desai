import ProjectCard from '../components/ProjectCard'
import SectionHeading from '../components/SectionHeading'
import { useContent } from '../context/ContentContext'
import PageShell from './PageShell'
import { Link } from 'react-router-dom'

export default function ProjectsPage() {
  const { projects } = useContent()
  return (
    <PageShell title="Projects & New Launches | Vikas U Desai" description="Explore current project opportunities and new launches in Mira Road East and nearby areas.">
      <main className="page-shell container">
      <SectionHeading
        eyebrow="Projects"
        title="Current project opportunities and upcoming launches."
        subtitle="Explore focused project recommendations for buyers looking for a practical, location-aware property decision."
      />

      <div className="card-grid three-col">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <nav className="detail-section" aria-label="Related project guidance">
        <h2>Continue exploring</h2>
        <p><Link to="/properties">Browse available properties</Link> · <Link to="/services">Compare consultancy services</Link> · <Link to="/blog">Read property insights</Link> · <Link to="/contact">Discuss a project</Link></p>
      </nav>
      </main>
    </PageShell>
  )
}
