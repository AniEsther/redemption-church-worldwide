import { useState } from 'react'
import { Quote } from 'lucide-react'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { TESTIMONIALS } from '../data/content'
import { api } from '../lib/api'
import { useApiData } from '../lib/useApiData'

export default function Testimonies() {
  const { data: testimonies } = useApiData(api.getTestimonies, TESTIMONIALS)
  const [form, setForm] = useState({ name: '', email: '', text: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.submitTestimony(form)
      setSent(true)
      setForm({ name: '', email: '', text: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHero eyebrow="Changed Lives" title="Testimonies" subtitle="Stories of God's faithfulness in our church family" />

      <section className="bg-cream py-24 dark:bg-brown-900">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 sm:grid-cols-2">
          {testimonies.map((t, i) => (
            <Reveal key={t._id || t.name} delay={(i % 2) + 1}>
              <div className="h-full rounded-2xl border border-brown-100 bg-white p-8 dark:border-brown-700 dark:bg-brown-800">
                <Quote className="h-7 w-7 text-orange-400" />
                <p className="mt-4 font-display italic leading-relaxed text-brown-700 dark:text-cream">&ldquo;{t.text}&rdquo;</p>
                <p className="eyebrow mt-5 text-xs text-orange-500">{t.name}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-xl px-6">
          <Reveal>
            <h2 className="text-center font-display text-2xl font-bold text-brown-700 dark:text-cream">
              Share Your Testimony
            </h2>
            {sent ? (
              <p className="mt-6 rounded-xl bg-orange-400/15 p-6 text-center text-brown-700 dark:text-cream">
                Thank you for sharing — your testimony will appear here once reviewed by our team.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-brown-100 bg-white p-8 dark:border-brown-700 dark:bg-brown-800">
                <input required placeholder="Full Name" value={form.name} onChange={set('name')} className="w-full rounded-lg border border-brown-200 bg-cream px-4 py-3 text-sm focus:border-orange-400 dark:border-brown-700 dark:bg-brown-900" />
                <input type="email" placeholder="Email (optional)" value={form.email} onChange={set('email')} className="w-full rounded-lg border border-brown-200 bg-cream px-4 py-3 text-sm focus:border-orange-400 dark:border-brown-700 dark:bg-brown-900" />
                <textarea required rows={4} placeholder="Share what God has done" value={form.text} onChange={set('text')} className="w-full rounded-lg border border-brown-200 bg-cream px-4 py-3 text-sm focus:border-orange-400 dark:border-brown-700 dark:bg-brown-900" />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button type="submit" disabled={loading} className="rounded-full bg-orange-400 px-8 py-4 eyebrow text-xs text-white transition-transform hover:scale-105 disabled:opacity-60">
                  {loading ? 'Submitting…' : 'Submit Testimony'}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}
