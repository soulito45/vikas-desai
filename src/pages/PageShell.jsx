import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initializeAnalytics, trackPageView } from '../utils/analytics'
import SeoMeta from './SeoMeta'

export default function PageShell({ title, description, schema, children }) {
  const location = useLocation()

  useEffect(() => {
    initializeAnalytics()
    trackPageView(location.pathname)
  }, [location.pathname])

  return (
    <>
      <SeoMeta title={title} description={description} path={location.pathname} pageSchema={schema} />
      {children}
    </>
  )
}
