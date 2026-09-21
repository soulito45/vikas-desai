import { MessageCircleMore } from 'lucide-react'
import { apiRequest } from '../services/api'
import { trackLead } from '../utils/analytics'

export default function WhatsAppButton({ title = 'Property', phone = '919920133345' }) {
  const message = encodeURIComponent(`Hello, I am interested in ${title}. Please share more details.`)

  const handleClick = async () => {
    try {
      await apiRequest('/whatsapp-lead', {
        method: 'POST',
        body: JSON.stringify({ title, source: 'floating-whatsapp-button' }),
      })
      trackLead('whatsapp', { title })
    } catch (error) {
      console.error('WhatsApp lead logging failed:', error)
    }
  }

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-float"
      aria-label={`WhatsApp about ${title}`}
      onClick={handleClick}
    >
      <MessageCircleMore size={22} />
    </a>
  )
}
