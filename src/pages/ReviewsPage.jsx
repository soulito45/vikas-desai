import SectionHeading from '../components/SectionHeading'
import ReviewCard from '../components/ReviewCard'
import { businessRating } from '../data/reviews'
import { useContent } from '../context/ContentContext'

export default function ReviewsPage() {
  const { reviews } = useContent()
  return (
    <main className="page-shell container">
      <SectionHeading
        eyebrow="Reviews"
        title="Client feedback and local trust."
        subtitle="These reviews reflect real business feedback as provided in the project brief. They are easy to replace with live Google reviews later."
      />

      <div className="rating-summary card large-rating">
        <div>
          <span className="rating-value">{businessRating.value}</span>
          <p>{businessRating.note}</p>
        </div>
      </div>

      <div className="card-grid three-col">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </main>
  )
}
