import { useEffect } from 'react'

const BUSINESS_NAME = 'Vikas U Desai Real Estate & Finance Consultancy'
const DEFAULT_DESCRIPTION = 'Property and finance guidance for residential, commercial, resale, and investment needs in Mira Road East.'

function setMeta(selector, elementTag, keyAttribute, keyValue, content) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement(elementTag)
    element.setAttribute(keyAttribute, keyValue)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

export default function SeoMeta({ title, description, path = '', pageSchema = null }) {
  useEffect(() => {
    const configuredUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '')
    const siteUrl = configuredUrl || window.location.origin
    const canonicalUrl = `${siteUrl}${path || window.location.pathname}`
    const businessId = `${siteUrl}/#business`
    const businessSchema = {
      '@type': 'RealEstateAgent',
      '@id': businessId,
      name: BUSINESS_NAME,
      telephone: '+91-9920133345',
      areaServed: ['Mira Road East', 'Mira Road West', 'Kashimira', 'Bhayandar'],
      description: DEFAULT_DESCRIPTION,
      url: siteUrl,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Shop No. 8, A2, Celeste Tower, JP North Road, Vinay Nagar, Kashimira',
        addressLocality: 'Mira Bhayandar',
        addressRegion: 'Maharashtra',
        postalCode: '401107',
        addressCountry: 'IN',
      },
    }
    const schemaGraph = {
      '@context': 'https://schema.org',
      '@graph': [
        businessSchema,
        { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: siteUrl, name: BUSINESS_NAME, publisher: { '@id': businessId } },
        {
          '@type': 'WebPage',
          '@id': `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name: title,
          description,
          isPartOf: { '@id': `${siteUrl}/#website` },
          about: { '@id': businessId },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
              ...(path && path !== '/' ? [{ '@type': 'ListItem', position: 2, name: title.split('|')[0].trim(), item: canonicalUrl }] : []),
            ],
          },
        },
        ...(pageSchema ? [pageSchema] : []),
      ],
    }

    document.title = title
    setMeta('meta[name="description"]', 'meta', 'name', 'description', description)
    setMeta('meta[name="robots"]', 'meta', 'name', 'robots', 'index,follow,max-image-preview:large')
    setMeta('meta[property="og:title"]', 'meta', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'meta', 'property', 'og:description', description)
    setMeta('meta[property="og:type"]', 'meta', 'property', 'og:type', 'website')
    setMeta('meta[property="og:url"]', 'meta', 'property', 'og:url', canonicalUrl)
    setMeta('meta[name="twitter:title"]', 'meta', 'name', 'twitter:title', title)
    setMeta('meta[name="twitter:description"]', 'meta', 'name', 'twitter:description', description)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl)

    let schema = document.head.querySelector('script[data-schema="site"]')
    if (!schema) {
      schema = document.createElement('script')
      schema.setAttribute('type', 'application/ld+json')
      schema.setAttribute('data-schema', 'site')
      document.head.appendChild(schema)
    }
    schema.textContent = JSON.stringify(schemaGraph)
  }, [title, description, path, pageSchema])

  return null
}
