import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../utils/analytics'
import SeoMeta from './SeoMeta'

export default function PageShell({ title, description, children }) {
  const location = useLocation()

  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])

  return (
    <>
      <SeoMeta title={title} description={description} />
      {children}
    </>
  )
}
