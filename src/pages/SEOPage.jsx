import { useEffect } from 'react'

export default function SEOPage({ title, description, children }) {
  useEffect(() => {
    document.title = title
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    }
  }, [title, description])

  return <>{children}</>
}
