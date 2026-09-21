import { useEffect } from 'react'

export default function SeoMeta({ title, description }) {
  useEffect(() => {
    document.title = title

    let metaTag = document.querySelector('meta[name="description"]')
    if (!metaTag) {
      metaTag = document.createElement('meta')
      metaTag.setAttribute('name', 'description')
      document.head.appendChild(metaTag)
    }
    metaTag.setAttribute('content', description)
  }, [title, description])

  return null
}
