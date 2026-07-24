import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import MessageButton from './components/MessageButton'
import FontLoader from './components/FontLoader'
import Loader from './components/Loader'
import { AdminAuthProvider } from './context/AdminAuthContext'

import Home from './pages/Home'
import About from './pages/About'
import Pastors from './pages/Pastors'
import Branches from './pages/Branches'
import Ministries from './pages/Ministries'
import MinistryDetail from './pages/MinistryDetail'
import MinistryActivities from './pages/MinistryActivities'
import Sermons from './pages/Sermons'
import Events from './pages/Events'
import EventRegister from './pages/EventRegister'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Give from './pages/Give'
import PrayerRequest from './pages/PrayerRequest'
import Testimonies from './pages/Testimonies'

import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminOverview from './pages/admin/AdminOverview'
import AdminMessages from './pages/admin/AdminMessages'
import AdminPrayerRequests from './pages/admin/AdminPrayerRequests'
import AdminSubscribers from './pages/admin/AdminSubscribers'
import AdminSermons from './pages/admin/AdminSermons'
import AdminEvents from './pages/admin/AdminEvents'
import AdminEventRegistrations from './pages/admin/AdminEventRegistrations'
import AdminMinistries from './pages/admin/AdminMinistries'
import AdminTestimonies from './pages/admin/AdminTestimonies'
import AdminGallery from './pages/admin/AdminGallery'
import AdminPastors from './pages/admin/AdminPastors'
import AdminBranches from './pages/admin/AdminBranches'
import AdminSettings from './pages/admin/AdminSettings'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [dark, setDark] = useState(false)
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <AdminAuthProvider>
      <FontLoader />
      <div className="min-h-screen bg-cream text-ink dark:bg-brown-900 dark:text-cream">
        {loading && !isAdmin && <Loader />}
        {!isAdmin && <Navbar dark={dark} setDark={setDark} />}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/pastors" element={<Pastors />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/ministries" element={<Ministries />} />
            <Route path="/ministries/:id" element={<MinistryDetail />} />
            <Route path="/ministries/:id/details" element={<MinistryActivities />} />
            <Route path="/sermons" element={<Sermons />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id/register" element={<EventRegister />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/give" element={<Give />} />
            <Route path="/prayer-request" element={<PrayerRequest />} />
            <Route path="/testimonies" element={<Testimonies />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="prayer-requests" element={<AdminPrayerRequests />} />
              <Route path="subscribers" element={<AdminSubscribers />} />
              <Route path="sermons" element={<AdminSermons />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="event-registrations" element={<AdminEventRegistrations />} />
              <Route path="ministries" element={<AdminMinistries />} />
              <Route path="testimonies" element={<AdminTestimonies />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="pastors" element={<AdminPastors />} />
              <Route path="branches" element={<AdminBranches />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </main>
        {!isAdmin && <Footer />}
        {!isAdmin && <ScrollToTop />}
        {!isAdmin && <MessageButton />}
      </div>
    </AdminAuthProvider>
  )
}
