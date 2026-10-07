import ReviewCard from '../components/ReviewCard'
import ReviewForm from '../components/ReviewForm'
import SectionHeading from '../components/SectionHeading'
import { businessRating } from '../data/reviews'
import { useContent } from '../context/ContentContext'
import PageShell from './PageShell'

export default function ReviewsPage() {
  const { reviews } = useContent()
  return (
    <PageShell title="Client Testimonials | Vikas U Desai" description="Read client feedback for Vikas U Desai Real Estate & Finance Consultancy and submit your own experience for moderation.">
      <main className="page-shell container">
      <SectionHeading eyebrow="Reviews" title="Client feedback and local trust." subtitle="Read client feedback and share your experience. Submitted reviews are reviewed before they are published." />
      <div className="rating-summary card large-rating"><div><span className="rating-value">{businessRating.value}</span><p>{businessRating.note}</p></div></div>
      <div className="review-layout">
        <div className="card-grid three-col">{reviews.map((review) => <ReviewCard key={review.id} review={review} />)}</div>
        <ReviewForm />
      </div>
      </main>
    </PageShell>
  )
}
