import { ArrowRight, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function BlogCard({ post }) {
  return (
    <article className="card blog-card">
      <img src={post.image} alt={post.title} loading="lazy" />
      <div className="card-body">
        <span className="pill subtle">{post.category}</span>
        <h3>{post.title}</h3>
        <div className="meta-row"><Clock3 size={15} /> {post.readTime}</div>
        <p>{post.excerpt}</p>
        <Link to={`/blog/${post.slug}`} className="text-link">
          Read article <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  )
}
