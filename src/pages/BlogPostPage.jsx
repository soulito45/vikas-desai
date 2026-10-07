import { Link, useParams } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import CTASection from '../components/CTASection'
import { useContent } from '../context/ContentContext'
import PageShell from './PageShell'

export default function BlogPostPage() {
  const { slug } = useParams()
  const { blogPosts } = useContent()
  const post = blogPosts.find((item) => item.slug === slug) || blogPosts[0]
  const articleSchema = {
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.publishedAt,
    author: { '@type': 'Organization', name: 'Vikas U Desai Real Estate & Finance Consultancy' },
    publisher: { '@type': 'Organization', name: 'Vikas U Desai Real Estate & Finance Consultancy' },
  }

  return (
    <PageShell
      title={`${post.title} | Vikas U Desai Real Estate Insights`}
      description={post.excerpt}
      schema={articleSchema}
    >
      <main className="page-shell container post-page">
      <article className="card article-card">
        <img src={post.image} alt={post.title} className="article-image" />
        <div className="article-body">
          <span className="pill subtle">{post.category}</span>
          <SectionHeading title={post.title} subtitle={`${post.readTime} • ${post.publishedAt}`} />
          <p>
            Buying a property is rarely just a financial decision. It is also about matching the right location, timeline, and long-term requirement to a home that fits your family and lifestyle. In areas like Mira Road East, Kashimira, and nearby pockets of Mira Bhayandar, local needs often evolve quickly, which makes it important to choose with clarity.
          </p>
          <p>
            A practical approach starts with budget reality, property purpose, and commute convenience. Buyers should compare not just the sale price but also maintenance costs, resale potential, and the pace of growth in the area. When the decision is made carefully, the property can support both everyday comfort and future value.
          </p>
          <p>
            This type of local guidance is especially useful for people evaluating new projects, resale homes, or long-term investment options. A well-informed decision is easier to make when the local market context is considered alongside your personal priorities.
          </p>
          <nav className="article-related-links" aria-label="Related resources">
            <h2>Related resources</h2>
            <ul>
              <li><Link to="/properties">Browse current properties</Link></li>
              <li><Link to="/projects">Explore new projects</Link></li>
              <li><Link to="/services">See property and finance services</Link></li>
              <li><Link to="/contact">Talk to a local property consultant</Link></li>
              <li><Link to="/blog">More property insights</Link></li>
            </ul>
          </nav>
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
