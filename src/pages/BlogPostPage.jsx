import { useParams } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import CTASection from '../components/CTASection'
import { blogPosts } from '../data/blog'
import PageShell from './PageShell'

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = blogPosts.find((item) => item.slug === slug) || blogPosts[0]

  return (
    <PageShell
      title={`${post.title} | Vikas U Desai Real Estate Insights`}
      description={post.excerpt}
    >
      <main className="page-shell container post-page">
      <article className="card article-card">
        <img src={post.image} alt={post.title} className="article-image" />
        <div className="article-body">
          <span className="pill subtle">{post.category}</span>
          <SectionHeading title={post.title} subtitle={`${post.readTime} • ${post.publishedAt}`} />
          <p>
            This article is a placeholder for future property guidance content. Replace it with a full editorial post when the consultancy is ready to publish real insights, local guidance, or market notes.
          </p>
          <p>
            The structure is designed to support future blog content, SEO optimization, and a content library for local property education in and around Mira Road East, Mira Road, and Mira Bhayandar.
          </p>
          <p>
            Use this page to add reliable local advice, legal pointers, buyer checklists, and real-estate tips without inventing statistics or claims.
          </p>
        </div>
      </article>

      <CTASection
        title="Need help with a property decision?"
        text="Speak with Vikas U Desai for practical guidance around buying, selling, or financing your next investment."
        primaryLabel="Contact us"
        primaryTo="/contact"
      />
      </main>
    </PageShell>
  )
}
