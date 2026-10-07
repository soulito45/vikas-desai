import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api'
import { trackLead } from '../utils/analytics'

const initialState = {
  name: '',
  phone: '',
  requirement: 'Buy',
  propertyType: 'Residential',
  budget: '',
  message: '',
  website: '',
}

export default function EnquiryForm() {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState(initialState)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await apiRequest('/enquiries', {
        method: 'POST',
        body: JSON.stringify(formData),
      })

      trackLead('enquiry-form')
      setSubmitted(true)
      setFormData(initialState)
      navigate('/thank-you')
    } catch (submitError) {
      setError(submitError.message || 'Unable to submit enquiry right now.')
    }
  }

  return (
    <form className="enquiry-form card" onSubmit={handleSubmit}>
      <h3>Request a Callback</h3>
      {submitted ? (
        <div className="success-box" role="status">
          Thanks for reaching out. Your enquiry has been noted and the consultancy will contact you soon.
        </div>
      ) : null}
      {error ? <div className="error-box">{error}</div> : null}

      <div className="form-grid">
        <label>
          <span>Name</span>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          <span>Phone</span>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </label>
        <label>
          <span>Requirement</span>
          <select name="requirement" value={formData.requirement} onChange={handleChange}>
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
            <option value="Invest">Invest</option>
            <option value="Finance">Finance</option>
          </select>
        </label>
        <label>
          <span>Property Type</span>
          <select name="propertyType" value={formData.propertyType} onChange={handleChange}>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Resale">Resale</option>
          </select>
        </label>
        <label>
          <span>Budget</span>
          <input type="text" name="budget" value={formData.budget} onChange={handleChange} placeholder="e.g. ₹60 Lakhs" />
        </label>
        <label className="full-width">
          <span>Message</span>
          <textarea name="message" value={formData.message} onChange={handleChange} rows="4" />
        </label>
        <input type="text" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" value="" readOnly />
      </div>

      <button type="submit" className="primary-button">Submit Enquiry</button>
    </form>
  )
}
