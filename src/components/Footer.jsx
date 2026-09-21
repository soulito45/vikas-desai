import { Link } from 'react-router-dom'
import { MapPin, Phone, Clock3 } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3>Vikas U Desai Real Estate & Finance Consultancy</h3>
          <p>
            Trusted property and finance guidance in Mira Road East with 18+ years of local experience.
          </p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/properties">Properties</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul className="footer-contact">
            <li><MapPin size={16} /> Shop No. 8, A2, Celeste Tower, JP North Road, Vinay Nagar, Kashimira, Mira Road East, Thane, Mira Bhayandar, Maharashtra 401107</li>
            <li><Phone size={16} /> <a href="tel:09920133345">099201 33345</a></li>
            <li><Clock3 size={16} /> By appointment</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© 2026 Vikas U Desai Real Estate & Finance Consultancy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
