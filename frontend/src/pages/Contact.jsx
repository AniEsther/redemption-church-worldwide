import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Send } from 'lucide-react'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { CHURCH } from '../data/content'
import { api } from '../lib/api'
import { useApiObject } from '../lib/useApiData'

const FALLBACK = {
  address: `${CHURCH.name}, ${CHURCH.address.join(', ')}`,
  phone: CHURCH.phone,
  email: CHURCH.email,
  mapEmbedUrl: 'https://www.google.com/maps?q=Enugu%2C%20Nigeria&output=embed',
}

export default function Contact() {
  const { data: settings } = useApiObject(api.getSettings, FALLBACK)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = new FormData(e.target)
    try {
      await api.submitContact({
        name: form.get('name'),
        email: form.get('email'),
        phone: form.get('phone'),
        message: form.get('message'),
      })
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHero eyebrow="We'd Love to Hear From You" title="Contact Us" />

      <section className="bg-cream py-24 dark:bg-brown-900">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-brown-700 dark:text-cream">Send a Message</h2>
            {sent ? (
              <p className="mt-6 rounded-xl bg-orange-400/15 p-6 text-brown-700 dark:text-cream">
                Thank you for reaching out. Our team will get back to you shortly.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <input name="name" required placeholder="Full Name" className="w-full rounded-lg border border-brown-200 bg-white px-4 py-3 text-sm focus:border-orange-400 dark:border-brown-700 dark:bg-brown-800" />
                <input name="email" required type="email" placeholder="Email Address" className="w-full rounded-lg border border-brown-200 bg-white px-4 py-3 text-sm focus:border-orange-400 dark:border-brown-700 dark:bg-brown-800" />
                <input name="phone" placeholder="Phone Number" className="w-full rounded-lg border border-brown-200 bg-white px-4 py-3 text-sm focus:border-orange-400 dark:border-brown-700 dark:bg-brown-800" />
                <textarea name="message" required placeholder="Your Message" rows={5} className="w-full rounded-lg border border-brown-200 bg-white px-4 py-3 text-sm focus:border-orange-400 dark:border-brown-700 dark:bg-brown-800" />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-full bg-orange-400 px-8 py-4 eyebrow text-xs text-white transition-transform hover:scale-105 disabled:opacity-60">
                  {loading ? 'Sending…' : 'Send Message'} <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </Reveal>

          <Reveal delay={2}>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-orange-500" />
                <p className="text-brown-600 dark:text-cream/70">{settings.address}</p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-5 w-5 flex-shrink-0 text-orange-500" />
                <p className="text-brown-600 dark:text-cream/70">{settings.phone}</p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 flex-shrink-0 text-orange-500" />
                <p className="text-brown-600 dark:text-cream/70">{settings.email}</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-orange-400/30 bg-orange-400/10 p-5">
              <p className="text-sm text-brown-700 dark:text-cream">
                Need prayer? <Link to="/prayer-request" className="font-semibold text-orange-600 underline hover:text-orange-500 dark:text-orange-300">Submit a prayer request</Link> and our prayer team will stand with you.
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-brown-200 bg-white p-5 dark:border-brown-700 dark:bg-brown-800">
              <p className="text-sm text-brown-700 dark:text-cream">
                Looking for a branch near you? <Link to="/branches" className="font-semibold text-orange-600 underline hover:text-orange-500 dark:text-orange-300">Find a location</Link>.
              </p>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-brown-100 shadow-lg dark:border-brown-700">
              <iframe
                title="Church location map"
                src={settings.mapEmbedUrl}
                className="h-72 w-full"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
