import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

const enquiries = []
const leads = []

const defaultBusiness = {
  name: 'Vikas U Desai Real Estate & Finance Consultancy',
  phone: '09920133345',
  address: 'Shop No. 8, A2, Celeste Tower, JP North Road, Vinay Nagar, Kashimira, Mira Road East, Mira Bhayandar, Maharashtra 401107',
  businessHours: 'Monday to Saturday • By appointment',
  googleMapsEmbed: 'https://www.google.com/maps?q=Mira%20Road%20East%20Maharashtra&output=embed',
  rating: '4.8+'
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/business', (_req, res) => {
  res.json(defaultBusiness)
})

app.get('/api/enquiries', (_req, res) => {
  res.json(enquiries)
})

app.post('/api/enquiries', (req, res) => {
  const payload = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...req.body,
  }

  enquiries.push(payload)
  leads.push({
    source: 'enquiry-form',
    ...payload,
  })

  res.status(201).json({
    success: true,
    message: 'Enquiry received successfully.',
    data: payload,
  })
})

app.get('/api/leads', (_req, res) => {
  res.json(leads)
})

app.post('/api/whatsapp-lead', (req, res) => {
  const payload = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    source: 'whatsapp',
    ...req.body,
  }

  leads.push(payload)
  res.status(201).json({ success: true, data: payload })
})

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`)
})
