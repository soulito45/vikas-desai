import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import './public-theme.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import AppointmentModal from './components/AppointmentModal'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import PropertiesPage from './pages/PropertiesPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ServicesPage from './pages/ServicesPage'
import ReviewsPage from './pages/ReviewsPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import ContactPage from './pages/ContactPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import PrivacyPage from './pages/PrivacyPage'
import FaqPage from './pages/FaqPage'
import NotFoundPage from './pages/NotFoundPage'
import ThankYouPage from './pages/ThankYouPage'
import { ContentProvider } from './context/ContentContext'

function AppShell() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className={`app-shell ${isAdminRoute ? 'admin-app-shell' : 'public-app-shell'}`}>
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <AppointmentModal />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {!isAdminRoute && <WhatsAppButton title="Vikas U Desai Real Estate & Finance Consultancy" />}
      {!isAdminRoute && <Footer />}
    </div>
  )
}

function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ContentProvider>
  )
}

export default App
