import crypto from 'node:crypto'
import express from 'express'
import cors from 'cors'
import { adminSeed } from '../src/data/adminSeed.js'

const app = express()
const PORT = Number(process.env.PORT || 4000)
const isProduction = process.env.NODE_ENV === 'production'
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173').split(',').map((origin) => origin.trim()).filter(Boolean)
const adminPassword = process.env.ADMIN_PASSWORD
const sessions = new Map()
const loginAttempts = new Map()
const enquiries = []
const leads = []
let adminContent = structuredClone(adminSeed)

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
  methods: ['GET', 'POST', 'PUT'],
}))
app.use(express.json({ limit: '32kb' }))

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map((entry) => {
    const [key, ...value] = entry.trim().split('=')
    return [key, decodeURIComponent(value.join('='))]
  }).filter(([key]) => key))
}

function requireAdmin(req, res, next) {
  const token = parseCookies(req.headers.cookie).admin_session
  const expiresAt = sessions.get(token)
  if (!token || !expiresAt || expiresAt < Date.now()) {
    sessions.delete(token)
    return res.status(401).json({ message: 'Admin authentication is required.' })
  }
  return next()
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

function validAdminContent(payload) {
  const allowedKeys = ['projects', 'properties', 'blogPosts', 'reviews', 'services']
  return payload && typeof payload === 'object' && !Array.isArray(payload)
    && !Object.keys(payload).some((key) => !allowedKeys.includes(key))
    && allowedKeys.every((key) => Array.isArray(payload[key]) && payload[key].length <= 200)
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))
app.get('/api/content', (_req, res) => res.json(adminContent))

app.get('/api/admin/session', requireAdmin, (_req, res) => res.json({ authenticated: true }))
app.post('/api/admin/login', (req, res) => {
  const ip = req.ip || 'unknown'
  const attempt = loginAttempts.get(ip) || { count: 0, resetAt: Date.now() + 15 * 60 * 1000 }
  if (attempt.resetAt < Date.now()) Object.assign(attempt, { count: 0, resetAt: Date.now() + 15 * 60 * 1000 })
  if (attempt.count >= 5) return res.status(429).json({ message: 'Too many login attempts. Try again later.' })
  const password = typeof req.body?.password === 'string' ? req.body.password : ''
  const matches = adminPassword && password.length === adminPassword.length && crypto.timingSafeEqual(Buffer.from(password), Buffer.from(adminPassword))
  if (!matches) {
    loginAttempts.set(ip, { ...attempt, count: attempt.count + 1 })
    return res.status(401).json({ message: 'Invalid credentials.' })
  }
  loginAttempts.delete(ip)
  const token = crypto.randomBytes(32).toString('hex')
  sessions.set(token, Date.now() + 8 * 60 * 60 * 1000)
  res.cookie('admin_session', token, { httpOnly: true, sameSite: 'strict', secure: isProduction, maxAge: 8 * 60 * 60 * 1000, path: '/' })
  return res.json({ authenticated: true })
})
app.post('/api/admin/logout', requireAdmin, (req, res) => {
  sessions.delete(parseCookies(req.headers.cookie).admin_session)
  res.clearCookie('admin_session', { httpOnly: true, sameSite: 'strict', secure: isProduction, path: '/' })
  res.status(204).end()
})
app.get('/api/admin/content', requireAdmin, (_req, res) => res.json(adminContent))
app.put('/api/admin/content', requireAdmin, (req, res) => {
  if (!validAdminContent(req.body)) return res.status(400).json({ message: 'Invalid content payload.' })
  adminContent = structuredClone(req.body)
  return res.json({ success: true, message: 'Admin content saved successfully.', data: adminContent })
})
app.get('/api/enquiries', requireAdmin, (_req, res) => res.json(enquiries))
app.get('/api/leads', requireAdmin, (_req, res) => res.json(leads))
app.post('/api/enquiries', (req, res) => {
  const enquiry = validateEnquiry(req.body)
  if (!enquiry) return res.status(400).json({ message: 'Please provide a valid name, phone number, and enquiry details.' })
  const payload = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...enquiry }
  enquiries.push(payload)
  leads.push({ source: 'enquiry-form', ...payload })
  return res.status(201).json({ success: true, message: 'Enquiry received successfully.', data: payload })
})
app.post('/api/whatsapp-lead', (req, res) => {
  const title = normalizeText(req.body?.title, 200)
  if (!title) return res.status(400).json({ message: 'A lead title is required.' })
  const payload = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), source: 'whatsapp', title }
  leads.push(payload)
  return res.status(201).json({ success: true, data: payload })
})
app.use((error, _req, res, _next) => {
  if (error?.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON payload.' })
  if (error?.message === 'Origin is not allowed') return res.status(403).json({ message: 'Origin is not allowed.' })
  return res.status(500).json({ message: 'Unexpected server error.' })
})
app.listen(PORT, () => console.log(`Backend API running on http://localhost:${PORT}`))
