import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Youtube, Twitter, MessageCircle, Send } from 'lucide-react'
import { CHURCH, SERVICE_TIMES } from '../data/content'
import { api } from '../lib/api'
import { useApiObject } from '../lib/useApiData'

const SETTINGS_FALLBACK = { churchName: CHURCH.name, slogan: CHURCH.slogan, facebookUrl: '#', instagramUrl: '#', youtubeUrl: '#', twitterUrl: '#', whatsappNumber: '', serviceTimes: SERVICE_TIMES, specialProgrammes: [] }

export default function Footer() {
  const { data: settings } = useApiObject(api.getSettings, SETTINGS_FALLBACK)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const socials = [
    { Icon: Facebook, href: settings.facebookUrl, label: 'Facebook' },
    { Icon: Instagram, href: settings.instagramUrl, label: 'Instagram' },
    { Icon: Youtube, href: settings.youtubeUrl, label: 'YouTube' },
    { Icon: Twitter, href: settings.twitterUrl, label: 'Twitter / X' },
    { Icon: MessageCircle, href: settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber}` : '#', label: 'WhatsApp' },
  ]

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    setError('')
    setLoading(true)
    try {
      await api.subscribeNewsletter(email)
      setSubscribed(true)
      setEmail('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="relative overflow-hidden bg-brown-800 text-cream">
      <div className="mx-auto grid grid-cols-1 items-start gap-12 px-6 py-16 max-w-7xl sm:grid-cols-3">
        <div>
          <span className="font-display text-lg font-semibold text-orange-300">{settings.churchName}</span>
          <p className="mt-3 text-sm leading-relaxed text-cream/60">{settings.slogan}</p>
          <div className="mt-5 flex gap-3">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href || '#'}
                target={href && href !== '#' ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-orange-400 hover:text-orange-400"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="eyebrow text-xs text-orange-300">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/60">
            {[
              ['About', '/about'],
              ['Ministries', '/ministries'],
              ['Sermons', '/sermons'],
              ['Events', '/events'],
              ['Branches', '/branches'],
              ['Testimonies', '/testimonies'],
              ['Contact', '/contact'],
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="transition-colors hover:text-orange-400">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-xs text-orange-300">Service Times</h4>
          <div className="mt-4 space-y-4 text-sm text-cream/60">
            {settings.serviceTimes.map((block) => (
              <div key={block.day}>
                <p className="text-cream/80">{block.day}</p>
                <ul className="mt-1 space-y-1">
                  {block.items.map((item) => (
                    <li key={item.name} className="flex justify-between gap-4">
                      <span>{item.name}</span>
                      <span className="text-orange-400/90">{item.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
          <p className="text-xs text-cream/40">© 2026 {settings.churchName}. All Rights Reserved.</p>

          <form onSubmit={handleSubscribe} className="flex w-full max-w-xs items-center gap-2 sm:w-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Subscribe to our newsletter"
              className="w-full border-b border-cream/20 bg-transparent py-1.5 text-xs text-cream placeholder:text-cream/40 focus:border-orange-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              aria-label="Subscribe"
              className="flex-shrink-0 text-orange-400 transition-colors hover:text-orange-300 disabled:opacity-60"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
        {(subscribed || error) && (
          <p className={`pb-4 text-center text-xs ${error ? 'text-red-400' : 'text-orange-400'}`}>
            {error || "Thank you — you're subscribed."}
          </p>
        )}
      </div>
    </footer>
  )
}
