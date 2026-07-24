import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CalendarCheck, Clock, MapPin, CheckCircle2 } from 'lucide-react'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import EventDateBadge from '../components/EventDateBadge'
import { api } from '../lib/api'
import { formatDate } from '../lib/useApiData'

export default function EventRegister() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api
      .getEvent(id)
      .then(setEvent)
      .catch(() => setNotFound(true))
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = new FormData(e.target)
    try {
      await api.registerForEvent(id, {
        name: form.get('name'),
        email: form.get('email'),
        phone: form.get('phone'),
      })
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (notFound) {
    return (
      <>
        <PageHero eyebrow="Events" title="Event Not Found" />
        <section className="bg-cream py-24 text-center dark:bg-brown-900">
          <p className="text-brown-600 dark:text-cream/70">
            This event may have been removed. <Link to="/events" className="text-orange-500 underline">See all events</Link>.
          </p>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHero eyebrow="Register" title="Event Registration" />

      <section className="bg-cream py-24 dark:bg-brown-900">
        <div className="mx-auto max-w-xl px-6">
          {!event ? (
            <p className="text-center text-sm text-brown-500 dark:text-cream/50">Loading event…</p>
          ) : (
            <>
              <Reveal className="mb-10 flex items-center gap-5 rounded-2xl border border-brown-100 bg-white p-6 dark:border-brown-700 dark:bg-brown-800">
                <EventDateBadge date={event.date} dateLabel={event.dateLabel} />
                <div>
                  <h2 className="font-display text-xl font-bold text-brown-700 dark:text-cream">{event.title}</h2>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-brown-500 dark:text-cream/60">
                    <span className="flex items-center gap-1"><CalendarCheck className="h-3.5 w-3.5" /> {event.dateLabel || formatDate(event.date)}</span>
                    {event.time && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {event.time}</span>}
                    {event.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {event.location}</span>}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={2}>
                {sent ? (
                  <div className="rounded-2xl bg-orange-400/15 p-10 text-center">
                    <CheckCircle2 className="mx-auto h-10 w-10 text-orange-500" />
                    <p className="mt-4 text-brown-700 dark:text-cream">
                      You&apos;re registered for {event.title}. We look forward to seeing you there!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-brown-100 bg-white p-8 dark:border-brown-700 dark:bg-brown-800">
                    <input name="name" required placeholder="Full Name" className="w-full rounded-lg border border-brown-200 bg-cream px-4 py-3 text-sm focus:border-orange-400 dark:border-brown-700 dark:bg-brown-900" />
                    <input name="email" required type="email" placeholder="Email Address" className="w-full rounded-lg border border-brown-200 bg-cream px-4 py-3 text-sm focus:border-orange-400 dark:border-brown-700 dark:bg-brown-900" />
                    <input name="phone" placeholder="Phone Number" className="w-full rounded-lg border border-brown-200 bg-cream px-4 py-3 text-sm focus:border-orange-400 dark:border-brown-700 dark:bg-brown-900" />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full rounded-full bg-orange-400 px-8 py-4 eyebrow text-xs text-white transition-transform hover:scale-105 disabled:opacity-60">
                      {loading ? 'Registering…' : 'Complete Registration'}
                    </button>
                  </form>
                )}
              </Reveal>
            </>
          )}
        </div>
      </section>
    </>
  )
}
