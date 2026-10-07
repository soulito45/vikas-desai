import BlogCard from '../components/BlogCard'
import SectionHeading from '../components/SectionHeading'
import { useContent } from '../context/ContentContext'
import PageShell from './PageShell'

export default function BlogPage() {
  const { blogPosts } = useContent()
  return (
    <PageShell title="Property Insights & Buying Guides | Vikas U Desai" description="Practical property, resale, home-loan, and local market guidance for buyers and investors in Mira Road East and nearby areas.">
    <main className="page-shell container">
      <SectionHeading
        eyebrow="Property insights"
        title="Helpful articles for buyers, sellers and investors."
        subtitle="A local resource for practical property and finance guidance in and around Mira Road East."
      />

      <div className="card-grid three-col">
        {blogPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </main>
    </PageShell>
  )
}
