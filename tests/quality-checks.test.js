import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
const seoMeta = fs.readFileSync(path.join(root, 'src', 'pages', 'SeoMeta.jsx'), 'utf8')
const detailPages = [
  fs.readFileSync(path.join(root, 'src', 'pages', 'PropertyDetailPage.jsx'), 'utf8'),
  fs.readFileSync(path.join(root, 'src', 'pages', 'ProjectDetailPage.jsx'), 'utf8'),
]

test('includes global SEO metadata', () => {
  assert.match(index, /name="description"/)
  assert.match(index, /og:title/)
  assert.match(index, /og:type/)
  assert.match(index, /theme-color/)
})

test('uses the current origin for canonical metadata', () => {
  assert.match(seoMeta, /window\.location\.origin/)
  assert.doesNotMatch(seoMeta, /vikasudesai\.example/)
})

test('property and project detail pages contain Google Maps embeds', () => {
  for (const page of detailPages) {
    assert.match(page, /google\.com\/maps/)
    assert.match(page, /loading="lazy"/)
    assert.match(page, /<PageShell/)
  }
})

test('performance-oriented lazy-loading is present for heavy media', () => {
  assert.match(fs.readFileSync(path.join(root, 'src', 'components', 'ImageGallery.jsx'), 'utf8'), /loading="lazy"/)
  assert.match(fs.readFileSync(path.join(root, 'src', 'pages', 'ContactPage.jsx'), 'utf8'), /loading="lazy"/)
})
