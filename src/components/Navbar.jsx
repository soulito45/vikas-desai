import { Menu, Phone, MessageCircleMore } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/properties', label: 'Properties' },
  { to: '/projects', label: 'Projects' },
  { to: '/services', label: 'Services' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

const navClass = ({ isActive }) =>
  `nav-link ${isActive ? 'active' : ''}`

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link to="/" className="brand" aria-label="Vikas U Desai Home">
          <span className="brand-mark">V</span>
          <div>
            <strong>Vikas U Desai</strong>
            <small>Real Estate & Finance Consultancy</small>
          </div>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <a href="tel:09920133345" className="nav-phone">
            <Phone size={16} />
            <span>099201 33345</span>
          </a>
          <a href="https://wa.me/919920133345" target="_blank" rel="noreferrer" className="nav-whatsapp">
            <MessageCircleMore size={16} />
            WhatsApp
          </a>
          <button type="button" className="menu-button" aria-label="Open menu">
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
