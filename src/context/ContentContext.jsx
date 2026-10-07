import { createContext, useContext, useEffect, useState } from 'react'
import { adminSeed } from '../data/adminSeed'
import { apiRequest } from '../services/api'
import { services as serviceDefinitions } from '../data/services'

const ContentContext = createContext(adminSeed)

function mergeContent(data = {}) {
  return Object.fromEntries(
    Object.entries(adminSeed).map(([key, seedValue]) => {
      const value = Array.isArray(data[key]) && data[key].length > 0 ? data[key] : seedValue
      return [key, value]
    }),
  )
}

function withServiceIcons(content) {
  return {
    ...content,
    services: content.services.map((service) => ({
      ...service,
      icon: serviceDefinitions.find((definition) => definition.id === service.id)?.icon || serviceDefinitions[0].icon,
    })),
  }
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => withServiceIcons(adminSeed))
  useEffect(() => {
    apiRequest('/content')
      .then((data) => {
        const merged = mergeContent(data)
        const reviews = merged.reviews.filter((review) => review.approved !== false && review.status !== 'pending')
        setContent(withServiceIcons({ ...merged, reviews }))
      })
      .catch(() => {})
  }, [])
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

export const useContent = () => useContext(ContentContext)
