import BlogCard from '../components/BlogCard'
import SectionHeading from '../components/SectionHeading'
import { useContent } from '../context/ContentContext'

export default function BlogPage() {
  const { blogPosts } = useContent()
  return (
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
  )
}
