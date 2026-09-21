import ProjectCard from '../components/ProjectCard'
import SectionHeading from '../components/SectionHeading'
import { useContent } from '../context/ContentContext'

export default function ProjectsPage() {
  const { projects } = useContent()
  return (
    <main className="page-shell container">
      <SectionHeading
        eyebrow="Projects"
        title="Current project opportunities and upcoming launches."
        subtitle="These project cards are intentionally sample placeholders that can later be replaced with actual developer data, brochure content, and verified details."
      />

      <div className="card-grid three-col">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  )
}
