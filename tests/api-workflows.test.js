import test from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const PORT = 4517
const projectDir = process.cwd()
const testDir = fs.mkdtempSync(path.join(projectDir, 'server', 'data', 'workflow-test-'))
const databasePath = path.join(testDir, 'app.db')
const server = spawn(process.execPath, ['--env-file-if-exists=.env', 'server/index.js'], {
  cwd: projectDir,
  env: {
    ...process.env,
    PORT: String(PORT),
    DATABASE_PATH: databasePath,
    ADMIN_USERNAME: 'workflow-test-admin',
    ADMIN_PASSWORD: 'workflow-test-password-strong-2026',
    FRONTEND_ORIGIN: 'http://localhost:5173',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
})

let serverOutput = ''
let ready = false
server.stdout.on('data', (chunk) => {
  serverOutput += chunk.toString()
  if (!ready && serverOutput.includes('Backend API listening')) ready = true
})
server.stderr.on('data', (chunk) => {
  serverOutput += chunk.toString()
})

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (ready) return
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error(`Backend did not start. Output: ${serverOutput}`)
}

async function request(pathname, options = {}) {
  const response = await fetch(`http://localhost:${PORT}${pathname}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:5173',
      ...(options.headers || {}),
    },
  })
  return { response, body: await response.json() }
}

test.before(async () => {
  await waitForServer()
})

test.after(async () => {
  server.kill('SIGTERM')
  await new Promise((resolve) => setTimeout(resolve, 500))
  fs.rmSync(testDir, { recursive: true, force: true })
})

test('accepts a review and stores it for moderation', async () => {
  const { response, body } = await request('/api/reviews', {
    method: 'POST',
    body: JSON.stringify({
      author: 'Automated Test',
      rating: 5,
      quote: 'Automated end-to-end review test.',
    }),
  })

  assert.equal(response.status, 201)
  assert.equal(body.data.status, 'pending')
  assert.equal(body.data.approved, false)
})

test('stores a WhatsApp lead and returns it as a new lead', async () => {
  const { response, body } = await request('/api/whatsapp-lead', {
    method: 'POST',
    body: JSON.stringify({
      title: 'WhatsApp automation test',
      phone: '919920133345',
      message: 'Automated lead capture test',
    }),
  })

  assert.equal(response.status, 201)
  assert.equal(body.data.source, 'whatsapp')
  assert.equal(body.data.status, 'new')

  const db = new DatabaseSync(databasePath)
  const persisted = db.prepare('SELECT data FROM leads WHERE id = ?').get(body.data.id)
  db.close()
  assert.ok(persisted)
  assert.equal(JSON.parse(persisted.data).source, 'whatsapp')
})

test('rejects admin login without a trusted browser origin', async () => {
  const response = await fetch(`http://localhost:${PORT}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://untrusted.example' },
    body: JSON.stringify({ username: 'workflow-test-admin', password: 'workflow-test-password-strong-2026' }),
  })
  assert.equal(response.status, 403)
})

test('rejects unauthenticated access to private admin lead records', async () => {
  const { response } = await request('/api/leads')
  assert.equal(response.status, 401)
})

test('valid login creates a session that can access role-protected admin endpoints', async () => {
  const login = await fetch(`http://localhost:${PORT}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:5173' },
    body: JSON.stringify({ username: 'workflow-test-admin', password: 'workflow-test-password-strong-2026' }),
  })
  assert.equal(login.status, 200)
  const cookie = login.headers.get('set-cookie')?.split(';')[0]
  assert.ok(cookie)

  const adminData = await fetch(`http://localhost:${PORT}/api/admin/content`, {
    headers: { Cookie: cookie, Origin: 'http://localhost:5173' },
  })
  assert.equal(adminData.status, 200)
})

test('rejects cross-origin authenticated admin mutations', async () => {
  const login = await fetch(`http://localhost:${PORT}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:5173' },
    body: JSON.stringify({ username: 'workflow-test-admin', password: 'workflow-test-password-strong-2026' }),
  })
  const cookie = login.headers.get('set-cookie')?.split(';')[0]
  const update = await fetch(`http://localhost:${PORT}/api/admin/content`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Origin: 'https://attacker.example', Cookie: cookie },
    body: JSON.stringify({ projects: [], properties: [], blogPosts: [], reviews: [], services: [] }),
  })
  assert.equal(update.status, 403)
})

test('does not expose pending reviews through public content', async () => {
  const { response, body } = await request('/api/content')
  assert.equal(response.status, 200)
  assert.equal(body.reviews.some((review) => review.status === 'pending'), false)
})

test('rejects admin content containing executable URL schemes', async () => {
  const login = await fetch(`http://localhost:${PORT}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:5173' },
    body: JSON.stringify({ username: 'workflow-test-admin', password: 'workflow-test-password-strong-2026' }),
  })
  const cookie = login.headers.get('set-cookie')?.split(';')[0]
  const response = await fetch(`http://localhost:${PORT}/api/admin/content`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:5173', Cookie: cookie },
    body: JSON.stringify({
      projects: [],
      properties: [{ id: 'bad', image: 'javascript:alert(1)' }],
      blogPosts: [],
      reviews: [],
      services: [],
    }),
  })
  assert.equal(response.status, 400)
})

test('enforces global API rate limits', async () => {
  let lastResponse
  for (let index = 0; index < 121; index += 1) {
    lastResponse = await fetch(`http://localhost:${PORT}/api/health`)
  }
  assert.equal(lastResponse.status, 429)
})
