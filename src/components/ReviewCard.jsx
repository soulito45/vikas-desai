import { Star } from 'lucide-react'

export default function ReviewCard({ review }) {
  return (
    <article className="card review-card">
      <div className="rating-row" aria-label={`${review.rating} star review`}>
        {Array.from({ length: review.rating }).map((_, index) => (
          <Star key={index} size={15} fill="currentColor" />
        ))}
      </div>
      <p className="review-quote">“{review.quote}”</p>
      <span className="review-author">{review.author}</span>
    </article>
  )
}
