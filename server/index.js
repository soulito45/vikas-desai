import crypto from 'node:crypto'
import path from 'node:path'
import fs from 'node:fs'
import express from 'express'
import cors from 'cors'
import { DatabaseSync } from 'node:sqlite'
import { adminSeed } from '../src/data/adminSeed.js'

const app = express()
const PORT = Number(process.env.PORT || 4000)
const isProduction = process.env.NODE_ENV === 'production'
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173').split(',').map((origin) => origin.trim()).filter(Boolean)
const adminUsername = process.env.ADMIN_USERNAME || 'admin'
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
const editorUsername = process.env.EDITOR_USERNAME || 'editor'
const editorPassword = process.env.EDITOR_PASSWORD || 'editor123'
const dataDir = path.join(process.cwd(), 'server', 'data')
fs.mkdirSync(dataDir, { recursive: true })
const dbPath = process.env.DATABASE_PATH || path.join(dataDir, 'app.db')
const db = new DatabaseSync(dbPath)
const sessions = new Map()
const loginAttempts = new Map()

const CONTENT_TABLES = {
  projects: 'projects',
  properties: 'properties',
  blogPosts: 'blog_posts',
  reviews: 'reviews',
  services: 'services',
}

function hashPassword(value) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

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
  const users = [
    { username: adminUsername, password: adminPassword, role: 'admin' },
    { username: editorUsername, password: editorPassword, role: 'editor' },
  ]

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

function appendRecord(tableName, item) {
  db.prepare(`INSERT INTO ${tableName} (id, data, created_at) VALUES (?, ?, ?)`).run(
    item.id || crypto.randomUUID(),
    JSON.stringify(item),
    item.createdAt || new Date().toISOString(),
  )
}

function normalizeText(value, maxLength = 500) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
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

function validAdminContent(payload) {
  const allowedKeys = ['projects', 'properties', 'blogPosts', 'reviews', 'services']
  return payload && typeof payload === 'object' && !Array.isArray(payload)
    && !Object.keys(payload).some((key) => !allowedKeys.includes(key))
    && allowedKeys.every((key) => Array.isArray(payload[key]) && payload[key].length <= 200)
}

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map((entry) => {
    const [key, ...value] = entry.trim().split('=')
    return [key, decodeURIComponent(value.join('='))]
  }).filter(([key]) => key))
}

function requireAdmin(req, res, next) {
  const token = parseCookies(req.headers.cookie).admin_session
  const session = sessions.get(token)
  if (!token || !session || session.expiresAt < Date.now()) {
    sessions.delete(token)
    return res.status(401).json({ message: 'Admin authentication is required.' })
  }
  req.admin = session
  return next()
}

function requireAnyRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.admin) return res.status(401).json({ message: 'Admin authentication is required.' })
    if (!allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action.' })
    }
    return next()
  }
}

function matchPassword(storedHash, password) {
  const expected = Buffer.from(storedHash || '', 'hex')
  const provided = Buffer.from(hashPassword(password), 'hex')
  if (expected.length !== provided.length) return false
  return crypto.timingSafeEqual(expected, provided)
}

ensureDatabase()
seedAdminUsers()

if (!adminPassword) console.warn('ADMIN_PASSWORD is not set. Admin login is disabled until it is configured.')

app.disable('x-powered-by')
app.use((req, res, next) => {
  res.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'Permissions-Policy': 'geolocation=(), microphone=(), camera=()' })
  next()
})
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('Origin is not allowed'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
app.use(express.json({ limit: '32kb' }))

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))
app.get('/api/content', (_req, res) => res.json(readAllContent()))
app.get('/api/admin/me', requireAdmin, (req, res) => res.json({ username: req.admin.username, role: req.admin.role }))
app.get('/api/admin/session', requireAdmin, (req, res) => res.json({ authenticated: true, username: req.admin.username, role: req.admin.role }))
app.post('/api/admin/login', (req, res) => {
  const ip = req.ip || 'unknown'
  const attempt = loginAttempts.get(ip) || { count: 0, resetAt: Date.now() + 15 * 60 * 1000 }
  if (attempt.resetAt < Date.now()) Object.assign(attempt, { count: 0, resetAt: Date.now() + 15 * 60 * 1000 })
  if (attempt.count >= 5) return res.status(429).json({ message: 'Too many login attempts. Try again later.' })

  const username = typeof req.body?.username === 'string' ? req.body.username.trim() : adminUsername
  const password = typeof req.body?.password === 'string' ? req.body.password : ''
  const user = db.prepare('SELECT username, password_hash, role FROM admin_users WHERE username = ?').get(username)
  const matchesDb = user && matchPassword(user.password_hash, password)
  const matchesEnvFallback = username === adminUsername && password === adminPassword

  if (!matchesDb && !matchesEnvFallback) {
    loginAttempts.set(ip, { ...attempt, count: attempt.count + 1 })
    return res.status(401).json({ message: 'Invalid credentials.' })
  }

  loginAttempts.delete(ip)
  const token = crypto.randomBytes(32).toString('hex')
  const sessionUser = user || { username: adminUsername, role: 'admin' }
  sessions.set(token, { username: sessionUser.username, role: sessionUser.role || 'admin', expiresAt: Date.now() + 8 * 60 * 60 * 1000 })
  res.cookie('admin_session', token, { httpOnly: true, sameSite: 'strict', secure: isProduction, maxAge: 8 * 60 * 60 * 1000, path: '/' })
  return res.json({ authenticated: true, username: sessionUser.username, role: sessionUser.role || 'admin' })
})
app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const token = parseCookies(req.headers.cookie).admin_session
  sessions.delete(token)
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
app.get('/api/appointments', requireAnyRole('admin', 'editor'), (_req, res) => res.json(readAppointments()))
app.post('/api/enquiries', (req, res) => {
  const enquiry = validateEnquiry(req.body)
  if (!enquiry) return res.status(400).json({ message: 'Please provide a valid name, phone number, and enquiry details.' })
  const payload = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...enquiry }
  appendRecord('enquiries', payload)
  appendRecord('leads', { source: 'enquiry-form', ...payload })
  return res.status(201).json({ success: true, message: 'Enquiry received successfully.', data: payload })
})
app.post('/api/appointments', (req, res) => {
  const appointment = validateAppointment(req.body)
  if (!appointment) return res.status(400).json({ message: 'Please provide a valid name, phone number, preferred date, preferred time, and appointment purpose.' })
  const payload = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...appointment }
  appendRecord('appointments', payload)
  appendRecord('leads', { source: 'appointment-booking', ...payload })
  return res.status(201).json({ success: true, message: 'Appointment booked successfully.', data: payload })
})
app.post('/api/whatsapp-lead', (req, res) => {
  const title = normalizeText(req.body?.title, 200)
  if (!title) return res.status(400).json({ message: 'A lead title is required.' })
  const payload = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), source: 'whatsapp', title }
  appendRecord('leads', payload)
  return res.status(201).json({ success: true, data: payload })
})
app.use((error, _req, res, _next) => {
  if (error?.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON payload.' })
  if (error?.message === 'Origin is not allowed') return res.status(403).json({ message: 'Origin is not allowed.' })
  return res.status(500).json({ message: 'Unexpected server error.' })
})
app.listen(PORT, () => console.log(`Backend API running on http://localhost:${PORT}`))
