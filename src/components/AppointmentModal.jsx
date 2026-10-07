import { useEffect, useState } from 'react'
import { CalendarDays, Clock3, UserRound, X } from 'lucide-react'
import { apiRequest } from '../services/api'

const initialState = {
  name: '',
  phone: '',
  preferredDate: '',
  preferredTime: '',
  purpose: 'Property consultation',
  website: '',
}

export default function AppointmentModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 700)

    return () => clearTimeout(timer)
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      await apiRequest('/appointments', {
        method: 'POST',
        body: JSON.stringify(formData),
      })

      setSuccess('Your appointment request has been received. The team will contact you shortly.')
      setFormData(initialState)
      setTimeout(() => {
        setIsOpen(false)
      }, 1500)
    } catch (submitError) {
      setError(submitError.message || 'Unable to book the appointment right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="appointment-modal-backdrop" role="dialog" aria-modal="true" aria-label="Book an appointment">
      <div className="appointment-modal card">
        <button type="button" className="appointment-close" onClick={() => setIsOpen(false)} aria-label="Close appointment form">
          <X size={18} />
        </button>

        <div className="appointment-header">
          <span className="eyebrow">Book an appointment</span>
          <h3>Speak with Vikas and Divyesh Desai</h3>
          <p>Schedule a consultation for property buying, selling, finance guidance, or investment advice.</p>
        </div>

        {success ? <div className="success-box">{success}</div> : null}
        {error ? <div className="error-box">{error}</div> : null}

        <form className="appointment-form" onSubmit={handleSubmit}>
          <label>
            <span><UserRound size={14} /> Full name</span>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>

          <label>
            <span>Phone number</span>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </label>

          <label>
            <span><CalendarDays size={14} /> Preferred date</span>
            <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} required />
          </label>

          <label>
            <span><Clock3 size={14} /> Preferred time</span>
            <input type="time" name="preferredTime" value={formData.preferredTime} onChange={handleChange} required />
          </label>

          <label>
            <span>Purpose</span>
            <select name="purpose" value={formData.purpose} onChange={handleChange}>
              <option value="Property consultation">Property consultation</option>
              <option value="Home buying">Home buying</option>
              <option value="Selling property">Selling property</option>
              <option value="Investment advice">Investment advice</option>
              <option value="Finance guidance">Finance guidance</option>
            </select>
          </label>

          <input type="text" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" value={formData.website} onChange={handleChange} />

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Booking...' : 'Confirm appointment'}
          </button>
        </form>
      </div>
    </div>
  )
}
