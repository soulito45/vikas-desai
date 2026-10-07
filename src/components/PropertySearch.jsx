import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialFilters = {
  location: '',
  type: '',
  configuration: '',
  status: '',
  budget: '',
}

export default function PropertySearch({ compact = false }) {
  const navigate = useNavigate()
  const [filters, setFilters] = useState(initialFilters)

  const update = (event) => setFilters((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => { if (value) params.set(key, value) })
    navigate(`/properties?${params.toString()}`)
  }

  return (
    <section className="property-search-wrap">
      <div className="container">
        <form className="property-search card" onSubmit={submit}>
          <div className={`search-grid ${compact ? 'compact' : ''}`}>
            <label><span>Location</span><select name="location" value={filters.location} onChange={update}><option value="">All areas</option><option value="Mira Road East">Mira Road East</option><option value="Mira Road West">Mira Road West</option><option value="Kashimira">Kashimira</option><option value="Bhayandar">Bhayandar</option></select></label>
            <label><span>Property type</span><select name="type" value={filters.type} onChange={update}><option value="">All types</option><option value="Residential">Residential</option><option value="Commercial">Commercial</option><option value="Plot">Plot</option></select></label>
            <label><span>Configuration</span><select name="configuration" value={filters.configuration} onChange={update}><option value="">Any configuration</option><option value="1 BHK">1 BHK</option><option value="2 BHK">2 BHK</option><option value="3 BHK">3 BHK</option><option value="4 BHK">4 BHK</option></select></label>
            <label><span>Status</span><select name="status" value={filters.status} onChange={update}><option value="">Any status</option><option value="Available">Available</option><option value="Under Construction">Under Construction</option><option value="Ready to Move">Ready to Move</option></select></label>
            <label><span>Budget</span><select name="budget" value={filters.budget} onChange={update}><option value="">Any budget</option><option value="₹50L">Up to ₹50L</option><option value="₹1Cr">Up to ₹1Cr</option><option value="₹2Cr">Up to ₹2Cr</option></select></label>
            <button type="submit" className="primary-button">Find Properties</button>
          </div>
        </form>
      </div>
    </section>
  )
}
