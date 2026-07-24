import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HandHeart, Quote, Sparkles } from 'lucide-react'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { api } from '../lib/api'
import { useApiData } from '../lib/useApiData'
import { TESTIMONIALS } from '../data/content'

export default function PrayerRequest() {
  const { data: testimonies } = useApiData(api.getTestimonies, TESTIMONIALS)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = new FormData(e.target)
    try {
      await api.submitPrayerRequest({
        name: form.get('name'),
        email: form.get('email'),
        category: form.get('category'),
        request: form.get('request'),
        confidential: form.get('confidential') === 'on',
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
      <PageHero eyebrow="We Will Pray With You" title="Prayer Request" subtitle="\u201cThe prayer of a righteous person is powerful and effective.\u201d — James 5:16" />

      <section className="bg-cream py-24 dark:bg-brown-900">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <Reveal>
            <Sparkles className="mx-auto h-8 w-8 text-orange-500" />
            <h2 className="mt-4 font-display text-2xl font-bold text-brown-700 dark:text-cream">
              Whatever You Are Facing, God Still Answers Prayer
            </h2>
            <p className="mt-4 leading-relaxed text-brown-600/80 dark:text-cream/70">
              You don&apos;t have to carry it alone. Whether it&apos;s sickness, a broken
              relationship, finances, or a decision that feels too heavy — bring it to God, and
              let us stand with you in prayer. Below are stories from members of our church family
              who brought their own burdens to God and watched Him move.
            </p>
          </Reveal>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonies.slice(0, 3).map((t, i) => (
            <Reveal key={t._id || t.name} delay={(i % 3) + 1}>
              <div className="h-full rounded-2xl border border-brown-100 bg-white p-6 dark:border-brown-700 dark:bg-brown-800">
                <Quote className="h-6 w-6 text-orange-400" />
                <p className="mt-3 text-sm italic leading-relaxed text-brown-600 dark:text-cream/80">&ldquo;{t.text}&rdquo;</p>
                <p className="eyebrow mt-4 text-[11px] text-orange-500">{t.name}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-6 max-w-5xl px-6 text-center">
          <Link to="/testimonies" className="eyebrow text-xs text-orange-500 hover:text-orange-600">
            Read More Testimonies →
          </Link>
        </Reveal>

        <div className="mx-auto mt-16 max-w-2xl px-6">
          <Reveal className="text-center">
            <h2 className="font-display text-2xl font-bold text-brown-700 dark:text-cream">
              Submit Your Prayer Request
            </h2>
            <p className="mt-2 text-sm text-brown-500 dark:text-cream/60">
              Our prayer team will stand in the gap with you. When God answers, we&apos;d love for
              you to <Link to="/testimonies" className="text-orange-500 underline hover:text-orange-600">share your own testimony</Link>.
            </p>
          </Reveal>

          <Reveal delay={2}>
            {sent ? (
              <div className="mt-6 rounded-2xl bg-orange-400/15 p-10 text-center">
                <HandHeart className="mx-auto h-10 w-10 text-orange-500" />
                <p className="mt-4 text-brown-700 dark:text-cream">
                  Your prayer request has been received. Our prayer team will be standing in the
                  gap with you.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-brown-100 bg-white p-8 dark:border-brown-700 dark:bg-brown-800">
                <input name="name" required placeholder="Full Name" className="w-full rounded-lg border border-brown-200 bg-cream px-4 py-3 text-sm focus:border-orange-400 dark:border-brown-700 dark:bg-brown-900" />
                <input name="email" required type="email" placeholder="Email Address" className="w-full rounded-lg border border-brown-200 bg-cream px-4 py-3 text-sm focus:border-orange-400 dark:border-brown-700 dark:bg-brown-900" />
                <select name="category" className="w-full rounded-lg border border-brown-200 bg-cream px-4 py-3 text-sm focus:border-orange-400 dark:border-brown-700 dark:bg-brown-900">
                  <option>Healing</option>
                  <option>Family</option>
                  <option>Finances</option>
                  <option>Guidance</option>
                  <option>Other</option>
                </select>
                <textarea name="request" required placeholder="Share your prayer request" rows={6} className="w-full rounded-lg border border-brown-200 bg-cream px-4 py-3 text-sm focus:border-orange-400 dark:border-brown-700 dark:bg-brown-900" />
                <label className="flex items-center gap-2 text-xs text-brown-500 dark:text-cream/60">
                  <input name="confidential" type="checkbox" className="accent-orange-400" /> Keep this request confidential
                </label>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button type="submit" disabled={loading} className="rounded-full bg-orange-400 px-8 py-4 eyebrow text-xs text-white transition-transform hover:scale-105 disabled:opacity-60">
                  {loading ? 'Submitting…' : 'Submit Request'}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}
