const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID

export function initializeAnalytics() {
  if (typeof window === 'undefined' || !measurementId || window.__vite_ga_initialized) return
  window.__vite_ga_initialized = true
  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function (...args) {
    window.dataLayer.push(args)
  }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  document.head.appendChild(script)
  window.gtag('js', new Date())
  window.gtag('config', measurementId, { send_page_view: false })
}

export function trackLead(source, payload = {}) {
  if (typeof window === 'undefined') return

  const safePayload = {}
  if (typeof payload.title === 'string') safePayload.title = payload.title.slice(0, 120)

  const event = {
    source,
    timestamp: new Date().toISOString(),
    ...safePayload,
  }

  if (window.dataLayer) {
    window.dataLayer.push({ event: 'lead_submitted', ...event })
  }
}

export function trackPageView(pathname) {
  if (typeof window === 'undefined') return

  if (window.dataLayer) {
    window.dataLayer.push({ event: 'page_view', pathname })
  }
}
