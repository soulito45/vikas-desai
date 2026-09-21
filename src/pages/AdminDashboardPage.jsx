import { useEffect, useState } from 'react'
import { adminSeed } from '../data/adminSeed'
import { apiRequest } from '../services/api'

const tabs = ['Projects', 'Properties', 'Blog Posts', 'Reviews', 'Services']

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('Projects')
  const [data, setData] = useState(adminSeed)
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        await apiRequest('/admin/session')
        setAuthenticated(true)
        const content = await apiRequest('/admin/content')
        setData(content)
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
      await apiRequest('/admin/login', { method: 'POST', body: JSON.stringify({ password }) })
      const content = await apiRequest('/admin/content')
      setData(content)
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

  const targetKey = activeTab.toLowerCase().replace(/\s+/g, '')
  const currentItems = data[targetKey] || []

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
      await apiRequest('/admin/content', {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    } catch (err) {
      console.error('Failed to save admin content:', err)
      setError('Could not save to backend. Changes are only local in this session.')
    } finally {
      setSaving(false)
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

        <button type="button" className="primary-btn" onClick={saveChanges} disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
        <button type="button" className="secondary-button" onClick={logout}>Sign out</button>
      </div>

      {error && <p className="form-message error">{error}</p>}

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
