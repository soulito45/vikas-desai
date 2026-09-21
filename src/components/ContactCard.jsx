import { MapPin, MessageCircleMore, Phone } from 'lucide-react'

export default function ContactCard() {
  return (
    <div className="card contact-card">
      <h3>Vikas U Desai Real Estate & Finance Consultancy</h3>
      <ul>
        <li><MapPin size={16} /> Shop No. 8, A2, Celeste Tower, JP North Road, Vinay Nagar, Kashimira, Mira Road East, Mira Bhayandar, Maharashtra 401107</li>
        <li><Phone size={16} /> <a href="tel:09920133345">099201 33345</a></li>
        <li><MessageCircleMore size={16} /> <a href="https://wa.me/919920133345" target="_blank" rel="noreferrer">WhatsApp</a></li>
      </ul>
    </div>
  )
}
