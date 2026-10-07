import crypto from 'node:crypto'
import path from 'node:path'
import fs from 'node:fs'
import express from 'express'
import cors from 'cors'
import { DatabaseSync } from 'node:sqlite'

const app = express()
const PORT = Number(process.env.PORT || 4000)
const isProduction = process.env.NODE_ENV === 'production'
const allowedOrigins = (process.env.FRONTEND_ORIGIN || '').split(',').map((origin) => origin.trim()).filter(Boolean)
const adminUsername = process.env.ADMIN_USERNAME || ''
const adminPassword = process.env.ADMIN_PASSWORD || ''
const editorUsername = process.env.EDITOR_USERNAME || ''
const editorPassword = process.env.EDITOR_PASSWORD || ''
if (adminUsername.length < 3 || adminPassword.length < 16) {
  throw new Error('Configure ADMIN_USERNAME and an ADMIN_PASSWORD of at least 16 characters before starting the API.')
}
if (Boolean(editorUsername) !== Boolean(editorPassword) || (editorPassword && editorPassword.length < 16)) {
  throw new Error('Configure both EDITOR_USERNAME and an EDITOR_PASSWORD of at least 16 characters, or leave both unset.')
}
if (isProduction && allowedOrigins.length === 0) {
  throw new Error('Configure FRONTEND_ORIGIN with the exact HTTPS site origin in production.')
}
if (process.platform !== 'win32') process.umask(0o077)
const dataDir = path.join(process.cwd(), 'server', 'data')
fs.mkdirSync(dataDir, { recursive: true, mode: 0o700 })
if (process.platform !== 'win32') fs.chmodSync(dataDir, 0o700)
const dbPath = process.env.DATABASE_PATH || path.join(dataDir, 'app.db')
const db = new DatabaseSync(dbPath)
if (process.platform !== 'win32') fs.chmodSync(dbPath, 0o600)
const loginAttempts = new Map()
const publicRequestAttempts = new Map()
const apiRequestAttempts = new Map()

const CONTENT_TABLES = {
  projects: 'projects',
  properties: 'properties',
  blogPosts: 'blog_posts',
  reviews: 'reviews',
  services: 'services',
}

function hashPassword(value, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(value, salt, 64).toString('hex')
  return `scrypt$${salt}$${hash}`
}

const DUMMY_PASSWORD_HASH = hashPassword(crypto.randomBytes(32).toString('hex'))

function safeJsonParse(value) {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function ensureDatabase() {
  db.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      token_hash TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      role TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `)
}

function seedAdminUsers() {
  const now = new Date().toISOString()
  const users = [{ username: adminUsername, password: adminPassword, role: 'admin' }]
  if (editorUsername) users.push({ username: editorUsername, password: editorPassword, role: 'editor' })
  const configuredNames = users.map((user) => user.username)
  const placeholders = configuredNames.map(() => '?').join(',')
  db.prepare(`DELETE FROM admin_users WHERE username NOT IN (${placeholders})`).run(...configuredNames)

  for (const user of users) {
    const existing = db.prepare('SELECT username FROM admin_users WHERE username = ?').get(user.username)
    if (existing) {
      db.prepare('UPDATE admin_users SET password_hash = ?, role = ? WHERE username = ?').run(hashPassword(user.password), user.role, user.username)
      continue
    }

    db.prepare('INSERT INTO admin_users (id, username, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)').run(
      crypto.randomUUID(),
      user.username,
      hashPassword(user.password),
      user.role,
      now,
    )
  }
}

function readTable(tableName) {
  const rows = db.prepare(`SELECT data FROM ${tableName} ORDER BY rowid DESC`).all()
  return rows
    .map((row) => safeJsonParse(row.data))
    .filter(Boolean)
}

function writeTable(tableName, items = []) {
  db.prepare(`DELETE FROM ${tableName}`).run()
  if (!Array.isArray(items)) return

  const insert = db.prepare(`INSERT INTO ${tableName} (id, data, updated_at) VALUES (?, ?, ?)`)
  const timestamp = new Date().toISOString()
  for (const item of items) {
    insert.run(item?.id || crypto.randomUUID(), JSON.stringify(item), timestamp)
  }
}

function readAllContent() {
  return Object.fromEntries(Object.entries(CONTENT_TABLES).map(([key, tableName]) => [key, readTable(tableName)]))
}

function writeAllContent(payload) {
  for (const [key, tableName] of Object.entries(CONTENT_TABLES)) {
    writeTable(tableName, Array.isArray(payload?.[key]) ? payload[key] : [])
  }
}

function readAppointments() {
  const rows = db.prepare('SELECT data FROM appointments ORDER BY rowid DESC').all()
  return rows.map((row) => safeJsonParse(row.data)).filter(Boolean)
}

function writeAppointments(list) {
  db.prepare('DELETE FROM appointments').run()
  const insert = db.prepare('INSERT INTO appointments (id, data, created_at) VALUES (?, ?, ?)')
  for (const item of list) {
    insert.run(item.id || crypto.randomUUID(), JSON.stringify(item), item.createdAt || new Date().toISOString())
  }
}

function readRecords(tableName) {
  const rows = db.prepare(`SELECT data FROM ${tableName} ORDER BY rowid DESC`).all()
  return rows.map((row) => safeJsonParse(row.data)).filter(Boolean)
}

function updateRecord(tableName, id, updates) {
  const rows = db.prepare(`SELECT data FROM ${tableName} WHERE id = ?`).all(id)
  if (!rows.length) return null
  const current = safeJsonParse(rows[0].data)
  const next = { ...current, ...updates, updatedAt: new Date().toISOString() }
  db.prepare(`UPDATE ${tableName} SET data = ? WHERE id = ?`).run(JSON.stringify(next), id)
  return next
}

function appendRecord(tableName, item) {
  const timestampColumn = tableName === 'reviews' ? 'updated_at' : 'created_at'
  db.prepare(`INSERT INTO ${tableName} (id, data, ${timestampColumn}) VALUES (?, ?, ?)`).run(
    item.id || crypto.randomUUID(),
    JSON.stringify(item),
    item.createdAt || new Date().toISOString(),
  )
}

function normalizeText(value, maxLength = 500) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function rejectBotSubmission(body = {}) {
  return normalizeText(body.website, 100).length > 0
}

function rateLimitPublicRequest(req, res, next) {
  const ip = req.ip || 'unknown'
  const now = Date.now()
  pruneExpiredAttempts(publicRequestAttempts, now)
  const attempt = publicRequestAttempts.get(ip) || { count: 0, resetAt: now + 15 * 60 * 1000 }
  if (attempt.resetAt < now) Object.assign(attempt, { count: 0, resetAt: now + 15 * 60 * 1000 })
  if (attempt.count >= 10) return res.status(429).json({ message: 'Too many submissions. Please wait before trying again.' })
  attempt.count += 1
  publicRequestAttempts.set(ip, attempt)
  return next()
}

function pruneExpiredAttempts(store, now) {
  for (const [key, value] of store) {
    if (value.resetAt <= now) store.delete(key)
  }
  if (store.size > 10000) {
    const excess = store.size - 10000
    let removed = 0
    for (const key of store.keys()) {
      store.delete(key)
      removed += 1
      if (removed >= excess) break
    }
  }
}

function rateLimitAdminLogin(req, res, next) {
  const ip = req.ip || 'unknown'
  const now = Date.now()
  pruneExpiredAttempts(loginAttempts, now)
  const attempt = loginAttempts.get(ip) || { count: 0, resetAt: now + 15 * 60 * 1000 }
  if (attempt.resetAt <= now) Object.assign(attempt, { count: 0, resetAt: now + 15 * 60 * 1000 })
  if (attempt.count >= 5) return res.status(429).json({ message: 'Too many login attempts. Try again later.' })
  attempt.count += 1
  loginAttempts.set(ip, attempt)
  return next()
}

function rateLimitApi(req, res, next) {
  const ip = req.ip || 'unknown'
  const now = Date.now()
  pruneExpiredAttempts(apiRequestAttempts, now)
  const attempt = apiRequestAttempts.get(ip) || { count: 0, resetAt: now + 60 * 1000 }
  if (attempt.resetAt <= now) Object.assign(attempt, { count: 0, resetAt: now + 60 * 1000 })
  if (attempt.count >= 120) return res.status(429).json({ message: 'Too many requests. Please try again shortly.' })
  attempt.count += 1
  apiRequestAttempts.set(ip, attempt)
  return next()
}

function requireSameOriginForAuthenticatedMutation(req, res, next) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next()
  if (!parseCookies(req.headers.cookie).admin_session) return next()
  const origin = req.get('origin')
  if (!origin || !allowedOrigins.includes(origin)) {
    return res.status(403).json({ message: 'Cross-origin request rejected.' })
  }
  return next()
}

function validateEnquiry(body = {}) {
  const name = normalizeText(body.name, 100)
  const phone = normalizeText(body.phone, 24)
  const requirement = normalizeText(body.requirement, 30)
  const propertyType = normalizeText(body.propertyType, 30)
  const budget = normalizeText(body.budget, 80)
  const message = normalizeText(body.message, 1500)
  if (name.length < 2 || !/^[\p{L}\s.'-]+$/u.test(name) || !/^[0-9+()\s-]{7,24}$/.test(phone)) return null
  if (!['Buy', 'Sell', 'Invest', 'Finance'].includes(requirement) || !['Residential', 'Commercial', 'Resale'].includes(propertyType)) return null
  return { name, phone, requirement, propertyType, budget, message }
}

function validateAppointment(body = {}) {
  const name = normalizeText(body.name, 100)
  const phone = normalizeText(body.phone, 24)
  const preferredDate = normalizeText(body.preferredDate, 20)
  const preferredTime = normalizeText(body.preferredTime, 20)
  const purpose = normalizeText(body.purpose, 80)

  if (name.length < 2 || !/^[\p{L}\s.'-]+$/u.test(name) || !/^[0-9+()\s-]{7,24}$/.test(phone)) return null
  if (!preferredDate || !preferredTime || !purpose) return null

  return { name, phone, preferredDate, preferredTime, purpose }
}

function validateReview(body = {}) {
  const author = normalizeText(body.author, 100)
  const rating = Number(body.rating)
  const quote = normalizeText(body.quote, 1500)
  if (author.length < 2 || quote.length < 10 || !Number.isInteger(rating) || rating < 1 || rating > 5) return null
  return { author, rating, quote }
}

function validAdminContent(payload) {
  const allowedKeys = ['projects', 'properties', 'blogPosts', 'reviews', 'services']
  const hasUnsafeUrl = (value, key = '') => {
    if (Array.isArray(value)) return value.some((item) => hasUnsafeUrl(item, key))
    if (!value || typeof value !== 'object') {
      if (typeof value !== 'string' || !/(url|image|gallery|link)/i.test(key)) return false
      const normalized = value.trim().toLowerCase()
      if (!normalized) return false
      if (/^(javascript|data|vbscript):/.test(normalized) || normalized.startsWith('//')) return true
      if (/^(image|gallery|url|mapurl)$/i.test(key)) return !/^(https:\/\/|\/)/i.test(normalized)
      return !/^(https:\/\/|mailto:|tel:|\/(?!\/))/i.test(normalized)
    }
    return Object.entries(value).some(([childKey, childValue]) => hasUnsafeUrl(childValue, childKey))
  }
  return payload && typeof payload === 'object' && !Array.isArray(payload)
    && !Object.keys(payload).some((key) => !allowedKeys.includes(key))
    && allowedKeys.every((key) => Array.isArray(payload[key]) && payload[key].length <= 200 && !hasUnsafeUrl(payload[key]))
}

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map((entry) => {
    const separator = entry.indexOf('=')
    if (separator < 0) return ['', '']
    const key = entry.slice(0, separator).trim()
    try { return [key, decodeURIComponent(entry.slice(separator + 1))] } catch { return ['', ''] }
  }).filter(([key]) => key))
}

function requireAdmin(req, res, next) {
  const token = parseCookies(req.headers.cookie).admin_session
  const tokenHash = token ? crypto.createHash('sha256').update(token).digest('hex') : ''
  const session = tokenHash ? db.prepare('SELECT username, role, expires_at FROM admin_sessions WHERE token_hash = ?').get(tokenHash) : null
  if (!token || !session || session.expires_at < Date.now()) {
    if (tokenHash) db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').run(tokenHash)
    return res.status(401).json({ message: 'Admin authentication is required.' })
  }
  req.admin = { username: session.username, role: session.role }
  return next()
}

function requireSameOriginForAdminMutation(req, res, next) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next()
  const origin = req.get('origin')
  const fetchSite = req.get('sec-fetch-site')
  if (origin ? !allowedOrigins.includes(origin) : fetchSite !== 'same-origin') {
    return res.status(403).json({ message: 'Cross-origin request rejected.' })
  }
  return next()
}

function requireAnyRole(...allowedRoles) {
  return (req, res, next) => {
    return requireAdmin(req, res, () => {
      if (!allowedRoles.includes(req.admin.role)) {
        return res.status(403).json({ message: 'You do not have permission to perform this action.' })
      }
      return next()
    })
  }
}

function matchPassword(storedHash, password) {
  const [algorithm, salt, hash] = String(storedHash || '').split('$')
  if (algorithm !== 'scrypt' || !salt || !hash) return false
  const expected = Buffer.from(hash, 'hex')
  const provided = crypto.scryptSync(password, salt, expected.length)
  return expected.length === provided.length && crypto.timingSafeEqual(expected, provided)
}

ensureDatabase()
seedAdminUsers()
db.prepare('DELETE FROM admin_sessions').run()
if (process.platform !== 'win32') {
  for (const suffix of ['', '-wal', '-shm']) {
    const databaseFile = `${dbPath}${suffix}`
    if (fs.existsSync(databaseFile)) fs.chmodSync(databaseFile, 0o600)
  }
}

app.disable('x-powered-by')
app.set('trust proxy', process.env.TRUST_PROXY === 'true' ? 1 : false)
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Cache-Control': 'no-store',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
  })
  if (isProduction) res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  next()
})
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, false)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    return callback(null, false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  maxAge: 600,
}))
app.use(express.json({ limit: '32kb' }))
app.use('/api', rateLimitApi, requireSameOriginForAuthenticatedMutation)
app.use('/api/admin', requireSameOriginForAdminMutation)

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))
app.get('/api/content', (_req, res) => {
  const content = readAllContent()
  content.reviews = content.reviews.filter((review) => review.approved === true)
  return res.json(content)
})
app.get('/api/admin/me', requireAdmin, (req, res) => res.json({ username: req.admin.username, role: req.admin.role }))
app.get('/api/admin/session', requireAdmin, (req, res) => res.json({ authenticated: true, username: req.admin.username, role: req.admin.role }))
app.post('/api/admin/login', rateLimitAdminLogin, (req, res) => {
  const ip = req.ip || 'unknown'
  const username = typeof req.body?.username === 'string' ? req.body.username.trim() : ''
  const password = typeof req.body?.password === 'string' ? req.body.password : ''
  const user = db.prepare('SELECT username, password_hash, role FROM admin_users WHERE username = ?').get(username)
  const passwordMatches = matchPassword(user?.password_hash || DUMMY_PASSWORD_HASH, password)
  const matchesDb = Boolean(user) && passwordMatches

  if (!matchesDb) {
    return res.status(401).json({ message: 'Invalid credentials.' })
  }

  loginAttempts.delete(ip)
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = Date.now() + 60 * 60 * 1000
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  db.prepare('INSERT INTO admin_sessions (token_hash, username, role, expires_at, created_at) VALUES (?, ?, ?, ?, ?)').run(tokenHash, user.username, user.role, expiresAt, new Date().toISOString())
  res.cookie('admin_session', token, { httpOnly: true, sameSite: 'strict', secure: isProduction, maxAge: 60 * 60 * 1000, path: '/' })
  return res.json({ authenticated: true, username: user.username, role: user.role })
})
app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const token = parseCookies(req.headers.cookie).admin_session
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').run(tokenHash)
  res.clearCookie('admin_session', { httpOnly: true, sameSite: 'strict', secure: isProduction, path: '/' })
  res.status(204).end()
})
app.get('/api/admin/content', requireAnyRole('admin', 'editor'), (_req, res) => res.json(readAllContent()))
app.put('/api/admin/content', requireAnyRole('admin', 'editor'), (req, res) => {
  if (!validAdminContent(req.body)) return res.status(400).json({ message: 'Invalid content payload.' })
  writeAllContent(req.body)
  return res.json({ success: true, message: 'Admin content saved successfully.', data: readAllContent() })
})
app.get('/api/enquiries', requireAnyRole('admin', 'editor'), (_req, res) => res.json(readRecords('enquiries')))
app.get('/api/leads', requireAnyRole('admin', 'editor'), (_req, res) => res.json(readRecords('leads')))
app.put('/api/leads/:id', requireAnyRole('admin', 'editor'), (req, res) => {
  const allowedStatuses = ['new', 'qualified', 'contacted', 'consultation', 'proposal', 'closed', 'rejected']
  const status = normalizeText(req.body?.status, 30).toLowerCase()
  const notes = normalizeText(req.body?.notes, 1500)
  if (!allowedStatuses.includes(status)) return res.status(400).json({ message: 'Invalid lead status.' })
  const lead = updateRecord('leads', req.params.id, { status, notes })
  if (!lead) return res.status(404).json({ message: 'Lead not found.' })
  return res.json({ success: true, data: lead })
})
app.get('/api/appointments', requireAnyRole('admin', 'editor'), (_req, res) => res.json(readAppointments()))
app.post('/api/enquiries', rateLimitPublicRequest, (req, res) => {
  if (rejectBotSubmission(req.body)) return res.status(400).json({ message: 'Unable to process this submission.' })
  const enquiry = validateEnquiry(req.body)
  if (!enquiry) return res.status(400).json({ message: 'Please provide a valid name, phone number, and enquiry details.' })
  const payload = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...enquiry }
  appendRecord('enquiries', payload)
  appendRecord('leads', { source: 'enquiry-form', ...payload })
  return res.status(201).json({ success: true, message: 'Enquiry received successfully.', data: payload })
})
app.post('/api/appointments', rateLimitPublicRequest, (req, res) => {
  if (rejectBotSubmission(req.body)) return res.status(400).json({ message: 'Unable to process this submission.' })
  const appointment = validateAppointment(req.body)
  if (!appointment) return res.status(400).json({ message: 'Please provide a valid name, phone number, preferred date, preferred time, and appointment purpose.' })
  const payload = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...appointment }
  appendRecord('appointments', payload)
  appendRecord('leads', { source: 'appointment-booking', ...payload })
  return res.status(201).json({ success: true, message: 'Appointment booked successfully.', data: payload })
})
app.post('/api/whatsapp-lead', rateLimitPublicRequest, (req, res) => {
  if (rejectBotSubmission(req.body)) return res.status(400).json({ message: 'Unable to process this submission.' })
  const title = normalizeText(req.body?.title, 200)
  const phone = normalizeText(req.body?.phone, 24)
  const message = normalizeText(req.body?.message, 1500)
  if (!title) return res.status(400).json({ message: 'A lead title is required.' })
  const payload = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    source: 'whatsapp',
    title,
    phone,
    message,
    status: 'new',
  }
  appendRecord('leads', payload)
  return res.status(201).json({ success: true, data: payload })
})
app.get('/api/reviews', (_req, res) => {
  const reviews = readTable('reviews').filter((review) => review.approved !== false)
  res.json(reviews)
})
app.post('/api/reviews', rateLimitPublicRequest, (req, res) => {
  if (rejectBotSubmission(req.body)) return res.status(400).json({ message: 'Unable to process this submission.' })
  const review = validateReview(req.body)
  if (!review) return res.status(400).json({ message: 'Please provide a valid name, rating, and review.' })
  const payload = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...review,
    approved: false,
    status: 'pending',
  }
  appendRecord('reviews', payload)
  return res.status(201).json({ success: true, message: 'Review submitted for moderation.', data: payload })
})
app.put('/api/reviews/:id', requireAnyRole('admin', 'editor'), (req, res) => {
  if (typeof req.body?.approved !== 'boolean') return res.status(400).json({ message: 'Approval must be true or false.' })
  const review = updateRecord('reviews', req.params.id, {
    approved: req.body.approved,
    status: req.body.approved ? 'approved' : 'rejected',
  })
  if (!review) return res.status(404).json({ message: 'Review not found.' })
  return res.json({ success: true, data: review })
})
app.use((error, _req, res, _next) => {
  if (error?.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON payload.' })
  if (error?.type === 'entity.too.large') return res.status(413).json({ message: 'Request payload is too large.' })
  return res.status(500).json({ message: 'Unexpected server error.' })
})
app.listen(PORT, () => console.log(`Backend API listening on port ${PORT}`))
