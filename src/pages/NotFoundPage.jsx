import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageShell from './PageShell'

export default function NotFoundPage() {
  return (
    <PageShell title="Page Not Found | Vikas U Desai" description="The requested page could not be found. Explore properties, services, reviews, or contact the consultancy.">
      <main className="page-shell container not-found-page">
        <div className="card empty-state">
          <Compass size={42} aria-hidden="true" />
          <span className="eyebrow">404</span>
          <h1>We could not find that page.</h1>
          <p>The page may have moved or the link may be incorrect. Return to the main site to continue exploring.</p>
          <Link to="/" className="primary-button"><ArrowLeft size={16} /> Back to home</Link>
        </div>
      </main>
    </PageShell>
  )
}
