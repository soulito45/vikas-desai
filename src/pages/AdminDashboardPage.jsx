import { useEffect, useState } from 'react'
import { adminSeed } from '../data/adminSeed'
import { apiRequest } from '../services/api'

const tabs = ['Projects', 'Properties', 'Blog Posts', 'Reviews', 'Services', 'Appointments']

const blankProperty = {
  id: '',
  title: '',
  location: '',
  price: '',
  configuration: '',
  carpetArea: '',
  floor: '',
  totalFloors: '',
  parking: '',
  furnishing: '',
  propertyAge: '',
  type: 'Residential',
  status: 'Available',
  description: '',
  image: '',
  gallery: [],
  highlighted: false,
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('Projects')
  const [data, setData] = useState(adminSeed)
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showPropertyForm, setShowPropertyForm] = useState(false)
  const [newProperty, setNewProperty] = useState(blankProperty)

  useEffect(() => {
    const loadData = async () => {
      try {
        await apiRequest('/admin/session')
        setAuthenticated(true)
        const content = await apiRequest('/admin/content')
        const appointments = await apiRequest('/appointments')
        setData({ ...content, appointments })
      } catch (err) {
        if (!err.message.includes('401')) setError('Backend unavailable. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const login = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await apiRequest('/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) })
      const content = await apiRequest('/admin/content')
      const appointments = await apiRequest('/appointments')
      setData({ ...content, appointments })
      setPassword('')
      setAuthenticated(true)
    } catch (err) {
      setError(err.message || 'Unable to sign in.')
    } finally {
      setSaving(false)
    }
  }

  const logout = async () => {
    try { await apiRequest('/admin/logout', { method: 'POST' }) } catch { /* Session may already be expired. */ }
    setAuthenticated(false)
  }

  const targetKey = activeTab === 'Appointments' ? 'appointments' : activeTab.toLowerCase().replace(/\s+/g, '')
  const currentItems = activeTab === 'Appointments' ? (data.appointments || []) : (data[targetKey] || [])

  const updateItem = (index, key, value) => {
    const next = [...(data[targetKey] || [])]
    next[index] = { ...next[index], [key]: value }
    setData((prev) => ({ ...prev, [targetKey]: next }))
  }

  const updateStructuredItem = (index, key, value) => {
    try {
      updateItem(index, key, JSON.parse(value))
      setError('')
    } catch {
      setError(`The ${key} field must contain valid JSON before it can be saved.`)
    }
  }

  const saveChanges = async () => {
    setSaving(true)
    setError('')

    try {
      const { appointments: _appointments, ...contentPayload } = data
      await apiRequest('/admin/content', {
        method: 'PUT',
        body: JSON.stringify(contentPayload),
      })
    } catch (err) {
      console.error('Failed to save admin content:', err)
      setError('Could not save to backend. Changes are only local in this session.')
    } finally {
      setSaving(false)
    }
  }

  const addProperty = async (event) => {
    event.preventDefault()
    if (!newProperty.title || !newProperty.location || !newProperty.price) {
      setError('Please fill in the title, location, and price before saving the property.')
      return
    }

    const propertyToAdd = {
      ...newProperty,
      id: `${(newProperty.title || 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      gallery: newProperty.image ? [newProperty.image] : [],
    }

    setData((prev) => ({
      ...prev,
      properties: [propertyToAdd, ...(prev.properties || [])],
    }))
    setNewProperty(blankProperty)
    setShowPropertyForm(false)
    setError('')

    try {
      const { appointments: _appointments, ...contentPayload } = { ...data, properties: [propertyToAdd, ...(data.properties || [])] }
      await apiRequest('/admin/content', {
        method: 'PUT',
        body: JSON.stringify(contentPayload),
      })
    } catch (err) {
      console.error('Failed to save new property:', err)
      setError('Property was added locally, but saving to the backend failed.')
    }
  }

  if (loading) return <main className="page-shell container admin-page"><p>Checking admin session...</p></main>

  if (!authenticated) {
    return (
      <main className="page-shell container admin-page">
        <section className="card admin-login">
          <h1>CMS Dashboard</h1>
          <p>Sign in to manage website content.</p>
          {error && <p className="form-message error" role="alert">{error}</p>}
          <form onSubmit={login} className="enquiry-form">
            <label><span>Username</span><input type="text" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required /></label>
            <label><span>Admin password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
            <button type="submit" className="primary-button" disabled={saving}>{saving ? 'Signing in...' : 'Sign in'}</button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell container admin-page">
      <h1>CMS Dashboard</h1>

      <div className="admin-toolbar">
        <div className="admin-tabs">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'admin-tab active' : 'admin-tab'}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="admin-actions">
          {activeTab === 'Properties' && (
            <button type="button" className="primary-button" onClick={() => setShowPropertyForm((prev) => !prev)}>
              {showPropertyForm ? 'Close form' : 'Add property'}
            </button>
          )}
          <button type="button" className="primary-button" onClick={saveChanges} disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
          <button type="button" className="secondary-button" onClick={logout}>Sign out</button>
        </div>
      </div>

      {error && <p className="form-message error">{error}</p>}

      {activeTab === 'Properties' && showPropertyForm && (
        <form onSubmit={addProperty} className="card admin-card property-create-form">
          <h3>Add New Property</h3>
          <div className="form-grid">
            <label><span>Title</span><input value={newProperty.title} onChange={(event) => setNewProperty((prev) => ({ ...prev, title: event.target.value }))} /></label>
            <label><span>Location</span><input value={newProperty.location} onChange={(event) => setNewProperty((prev) => ({ ...prev, location: event.target.value }))} /></label>
            <label><span>Price</span><input value={newProperty.price} onChange={(event) => setNewProperty((prev) => ({ ...prev, price: event.target.value }))} /></label>
            <label><span>Configuration</span><input value={newProperty.configuration} onChange={(event) => setNewProperty((prev) => ({ ...prev, configuration: event.target.value }))} /></label>
            <label><span>Carpet area</span><input value={newProperty.carpetArea} onChange={(event) => setNewProperty((prev) => ({ ...prev, carpetArea: event.target.value }))} /></label>
            <label><span>Floor</span><input value={newProperty.floor} onChange={(event) => setNewProperty((prev) => ({ ...prev, floor: event.target.value }))} /></label>
            <label><span>Total floors</span><input value={newProperty.totalFloors} onChange={(event) => setNewProperty((prev) => ({ ...prev, totalFloors: event.target.value }))} /></label>
            <label><span>Parking</span><input value={newProperty.parking} onChange={(event) => setNewProperty((prev) => ({ ...prev, parking: event.target.value }))} /></label>
            <label><span>Furnishing</span><input value={newProperty.furnishing} onChange={(event) => setNewProperty((prev) => ({ ...prev, furnishing: event.target.value }))} /></label>
            <label><span>Property age</span><input value={newProperty.propertyAge} onChange={(event) => setNewProperty((prev) => ({ ...prev, propertyAge: event.target.value }))} /></label>
            <label><span>Type</span><select value={newProperty.type} onChange={(event) => setNewProperty((prev) => ({ ...prev, type: event.target.value }))}><option>Residential</option><option>Commercial</option></select></label>
            <label><span>Status</span><input value={newProperty.status} onChange={(event) => setNewProperty((prev) => ({ ...prev, status: event.target.value }))} /></label>
            <label className="full-width"><span>Image URL</span><input value={newProperty.image} onChange={(event) => setNewProperty((prev) => ({ ...prev, image: event.target.value }))} /></label>
            <label className="full-width"><span>Description</span><textarea value={newProperty.description} onChange={(event) => setNewProperty((prev) => ({ ...prev, description: event.target.value }))} rows="4" /></label>
          </div>
          <button type="submit" className="primary-button">Create property</button>
        </form>
      )}

      <div className="admin-grid">
          {currentItems.map((item, index) => (
            <div key={item.id || index} className="card admin-card">
              <h3>{item.title || item.name || 'Untitled item'}</h3>
              {Object.entries(item).map(([key, value]) => {
                return (
                  <label key={key} className="admin-field">
                    <span>{key}</span>
                    {typeof value === 'object' ? (
                      <textarea value={JSON.stringify(value, null, 2)} onChange={(event) => updateStructuredItem(index, key, event.target.value)} rows="6" spellCheck="false" />
                    ) : (
                      <input value={String(value)} onChange={(event) => updateItem(index, key, event.target.value)} />
                    )}
                  </label>
                )
              })}
            </div>
          ))}
      </div>
    </main>
  )
}
