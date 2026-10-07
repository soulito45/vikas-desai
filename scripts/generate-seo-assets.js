import fs from 'node:fs'
import path from 'node:path'
import { sampleProperties } from '../src/data/properties.js'
import { sampleProjects } from '../src/data/projects.js'
import { blogPosts } from '../src/data/blog.js'

function readConfiguredSiteUrl() {
  if (process.env.VITE_SITE_URL) return process.env.VITE_SITE_URL.trim()
  const envFile = path.resolve('.env')
  if (!fs.existsSync(envFile)) return ''
  const setting = fs.readFileSync(envFile, 'utf8').match(/^\s*VITE_SITE_URL\s*=\s*(.*?)\s*$/m)?.[1] || ''
  return setting.replace(/^['"]|['"]$/g, '').trim()
}

const origin = readConfiguredSiteUrl().replace(/\/$/, '')
if (!origin || !/^https:\/\//i.test(origin)) {
  console.warn('VITE_SITE_URL is not configured with an HTTPS production origin; sitemap.xml is omitted to avoid publishing invalid canonical URLs.')
  process.exit(0)
}

const routes = [
  ['/', '1.0'],
  ['/about', '0.8'],
  ['/properties', '0.9'],
  ['/projects', '0.8'],
  ['/services', '0.8'],
  ['/reviews', '0.7'],
  ['/blog', '0.7'],
  ['/contact', '0.9'],
  ['/privacy', '0.3'],
  ['/faq', '0.5'],
  ...sampleProperties.map((property) => [`/properties/${property.id}`, '0.7']),
  ...sampleProjects.map((project) => [`/projects/${project.id}`, '0.7']),
  ...blogPosts.map((post) => [`/blog/${post.slug}`, '0.6']),
]
const urls = routes.map(([route, priority]) => `  <url><loc>${origin}${route}</loc><priority>${priority}</priority></url>`)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
const robots = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`
const distDirectory = path.resolve('dist')
fs.mkdirSync(distDirectory, { recursive: true })
fs.writeFileSync(path.join(distDirectory, 'sitemap.xml'), sitemap)
fs.writeFileSync(path.join(distDirectory, 'robots.txt'), robots)
console.log(`Generated sitemap.xml and robots.txt for ${origin}`)
