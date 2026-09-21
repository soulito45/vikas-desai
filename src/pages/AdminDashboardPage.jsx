import { useState } from 'react'
import { adminSeed } from '../data/adminSeed'

const tabs = ['Projects', 'Properties', 'Blog Posts', 'Reviews', 'Services']

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('Projects')
  const [data, setData] = useState(adminSeed)

  const currentItems = data[`${activeTab.toLowerCase().replace(/\s+/g, '')}`] || []

  const updateItem = (index, key, value) => {
    const targetKey = activeTab.toLowerCase().replace(/\s+/g, '')
    const next = [...data[targetKey]]
    next[index] = { ...next[index], [key]: value }
    setData((prev) => ({ ...prev, [targetKey]: next }))
  }

  return (
    <main className="page-shell container admin-page">
      <h1>CMS Dashboard</h1>
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

      <div className="admin-grid">
        {currentItems.map((item, index) => (
          <div key={item.id || index} className="card admin-card">
            <h3>{item.title || item.name || 'Untitled item'}</h3>
            {Object.entries(item).map(([key, value]) => {
              if (typeof value === 'object' && !Array.isArray(value)) return null

              return (
                <label key={key} className="admin-field">
                  <span>{key}</span>
                  {Array.isArray(value) ? (
                    <textarea value={value.join(', ')} onChange={(event) => updateItem(index, key, event.target.value.split(',').map((part) => part.trim()).filter(Boolean))} />
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
