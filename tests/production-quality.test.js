import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

test('public routes include required policy and support pages', () => {
  const app = read('src/App.jsx')
  assert.match(app, /path="\/privacy"/)
  assert.match(app, /path="\/faq"/)
  assert.match(app, /path="\/thank-you"/)
  assert.match(app, /path="\*"/)
})

test('page metadata and discoverability assets use a production domain', () => {
  const robots = read('public/robots.txt')
  const html = read('index.html')
  const seoMeta = read('src/pages/SeoMeta.jsx')
  const sitemapGenerator = read('scripts/generate-seo-assets.js')
  assert.doesNotMatch(robots, /localhost|vikasudesai\.example/)
  assert.match(robots, /Allow: \/\n/)
  assert.match(seoMeta, /VITE_SITE_URL/)
  assert.match(sitemapGenerator, /VITE_SITE_URL/)
  assert.match(sitemapGenerator, /sampleProperties\.map/)
  assert.match(sitemapGenerator, /sampleProjects\.map/)
  assert.match(sitemapGenerator, /blogPosts\.map/)
  assert.match(html, /og:image/)
  assert.match(html, /twitter:card/)
  assert.match(seoMeta, /application\/ld\+json/)
})

test('global pages have complete metadata and indexable directives', () => {
  const seoMeta = read('src/pages/SeoMeta.jsx')
  assert.match(seoMeta, /name="robots"/)
  assert.match(seoMeta, /index,follow/)
  assert.match(seoMeta, /rel="canonical"/)
  assert.match(seoMeta, /og:description/)
  assert.match(seoMeta, /twitter:description/)
  assert.match(seoMeta, /BreadcrumbList/)
})

test('detail and editorial pages provide contextual internal links', () => {
  const propertyCard = read('src/components/PropertyCard.jsx')
  const projectCard = read('src/components/ProjectCard.jsx')
  const blogPost = read('src/pages/BlogPostPage.jsx')
  const cta = read('src/components/CTASection.jsx')
  assert.match(propertyCard, /\/properties\/\$\{property\.id\}/)
  assert.match(projectCard, /\/projects\/\$\{project\.id\}/)
  assert.match(blogPost, /Related resources/)
  assert.match(cta, /isExternal/)
})

test('server fails closed for credentials and uses secure password/session handling', () => {
  const server = read('server/index.js')
  const envExample = read('.env.example')
  const gitignore = read('.gitignore')
  assert.match(server, /ADMIN_PASSWORD of at least 16 characters/)
  assert.doesNotMatch(server, /ADMIN_PASSWORD \|\| 'admin123'/)
  assert.match(server, /crypto\.scryptSync/)
  assert.match(server, /DUMMY_PASSWORD_HASH/)
  assert.match(server, /admin_sessions/)
  assert.match(server, /DELETE FROM admin_sessions/)
  assert.doesNotMatch(server, /matchesEnvFallback/)
  assert.match(server, /secure: isProduction/)
  assert.match(server, /requireSameOriginForAuthenticatedMutation/)
  assert.match(server, /rateLimitApi/)
  assert.match(server, /Strict-Transport-Security/)
  assert.match(envExample, /ADMIN_PASSWORD=$/m)
  assert.match(gitignore, /^\.env$/m)
  assert.match(gitignore, /server\/data\/\*\.db/)
})

test('does not include payment, webhook, upload, or outbound URL-fetch handlers', () => {
  const server = read('server/index.js')
  assert.doesNotMatch(server, /multer|upload\.single|express\.raw\(\).*webhook/i)
  assert.doesNotMatch(server, /fetch\(req\.body|axios\(req\.body|https?\.get\(req\.body/i)
  assert.doesNotMatch(server, /payment|webhook/i)
})

test('production headers and build settings mitigate XSS and source-map exposure', () => {
  const headers = read('public/_headers')
  const vite = read('vite.config.js')
  assert.match(headers, /Content-Security-Policy/)
  assert.match(headers, /script-src 'self'/)
  assert.doesNotMatch(headers, /script-src[^\n]*unsafe-inline/)
  assert.match(headers, /X-Content-Type-Options: nosniff/)
  assert.match(headers, /Strict-Transport-Security/)
  assert.match(vite, /sourcemap: false/)
  assert.match(vite, /server\/data/)
  assert.match(vite, /\*\*\/\*\.db/)
})

test('analytics excludes personal form fields and sensitive values are not logged', () => {
  const analytics = read('src/utils/analytics.js')
  const enquiry = read('src/components/EnquiryForm.jsx')
  const admin = read('src/pages/AdminDashboardPage.jsx')
  assert.doesNotMatch(analytics, /console\.(info|log).*Lead/)
  assert.doesNotMatch(analytics, /payload,/)
  assert.match(enquiry, /trackLead\('enquiry-form'\)/)
  assert.doesNotMatch(enquiry, /trackLead\('enquiry-form',\s*formData\)/)
  assert.doesNotMatch(admin, /console\.(error|log)/)
})

test('homepage hero uses scroll-driven parallax with responsive and reduced-motion support', () => {
  const hero = read('src/components/Hero.jsx')
  const styles = read('src/public-theme.css')
  const home = read('src/pages/HomePage.jsx')
  assert.match(home, /<Hero/)
  assert.match(hero, /hero-scroll-progress/)
  assert.match(hero, /requestAnimationFrame/)
  assert.match(hero, /hero-photo-scene/)
  assert.match(styles, /hero-photo-scene img/)
  assert.doesNotMatch(styles, /hero-building-front|hero-building-back|hero-interior-light/)
  assert.match(styles, /@media \(max-width: 820px\)/)
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/)
  assert.doesNotMatch(home, /<ScrollStory/)
})

test('homepage keeps only a compact set of core landing sections', () => {
  const home = read('src/pages/HomePage.jsx')
  assert.doesNotMatch(home, /PropertySearch/)
  assert.match(home, /home-listings-section/)
  assert.match(home, /home-story-section/)
  assert.doesNotMatch(home, /trust-grid|service-area-groups|card-grid three-col.*reviews/s)
})

test('analytics and form spam controls are wired', () => {
  const forms = [read('src/components/EnquiryForm.jsx'), read('src/components/ReviewForm.jsx')]
  const analytics = read('src/utils/analytics.js')
  for (const form of forms) {
    assert.match(form, /name="website"/)
    assert.match(form, /auto(?:Complete)?="off"/)
  }
  assert.match(analytics, /gtag\(/)
  assert.match(analytics, /dataLayer/)
})

test('public navigation exposes internal support links', () => {
  const footer = read('src/components/Footer.jsx')
  assert.match(footer, /to="\/privacy"/)
  assert.match(footer, /to="\/faq"/)
  assert.match(footer, /to="\/reviews"/)
})
