export function trackLead(source, payload = {}) {
  if (typeof window === 'undefined') return

  const event = {
    source,
    payload,
    timestamp: new Date().toISOString(),
  }

  console.info('Lead tracked', event)

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
