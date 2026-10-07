import { useState } from 'react'
import { apiRequest } from '../services/api'

export default function ReviewForm() {
  const [form, setForm] = useState({ author: '', rating: 5, quote: '', website: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await apiRequest('/reviews', { method: 'POST', body: JSON.stringify(form) })
      setSubmitted(true)
      setForm({ author: '', rating: 5, quote: '', website: '' })
    } catch (requestError) {
      setError(requestError.message || 'Unable to submit review.')
    }
  }

  return (
    <form className="enquiry-form card" onSubmit={submit}>
      <h3>Share your experience</h3>
      <p>Reviews are reviewed before appearing publicly.</p>
      {submitted && <div className="success-box">Thank you. Your review is awaiting moderation.</div>}
      {error && <div className="error-box">{error}</div>}
      <div className="form-grid">
        <label><span>Your name</span><input required minLength="2" value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} /></label>
        <label><span>Rating</span><select value={form.rating} onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })}><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select></label>
        <label className="full-width"><span>Review</span><textarea required minLength="10" rows="5" value={form.quote} onChange={(event) => setForm({ ...form, quote: event.target.value })} /></label>
        <input type="text" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} />
      </div>
      <button className="primary-button" type="submit">Submit for review</button>
    </form>
  )
}
