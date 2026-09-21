import ProjectCard from '../components/ProjectCard'
import SectionHeading from '../components/SectionHeading'
import { sampleProjects } from '../data/projects'

export default function ProjectsPage() {
  return (
    <main className="page-shell container">
      <SectionHeading
        eyebrow="Projects"
        title="Current project opportunities and upcoming launches."
        subtitle="These project cards are intentionally sample placeholders that can later be replaced with actual developer data, brochure content, and verified details."
      />

      <div className="card-grid three-col">
        {sampleProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  )
}
