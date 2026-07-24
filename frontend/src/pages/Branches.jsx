import { useState } from 'react'
import { MapPin, User, Phone, Mail } from 'lucide-react'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { api } from '../lib/api'
import { useApiData } from '../lib/useApiData'

const FALLBACK = [
  {
    name: 'The Redemption Church Worldwide — Enugu (Headquarters)',
    location: 'No. 8 Moses Ogbodo Street, Topland, Enugu, Nigeria',
    pastorName: 'Rev. Dr. Chimaobi Aninwene',
    phone: '+234 800 000 0000',
    email: 'info@redemptionchurchworldwide.org',
  },
]

export default function Branches() {
  const { data: branches } = useApiData(api.getBranches, FALLBACK)
  const [activeIdx, setActiveIdx] = useState(0)
  const active = branches[activeIdx]

  return (
    <>
      <PageHero eyebrow="Find Us" title="Our Branches" subtitle="The Redemption Church Worldwide is planted in communities near you" />

      <section className="bg-cream py-24 dark:bg-brown-900">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 lg:grid-cols-[280px_1fr]">
          <Reveal>
            <div className="space-y-2">
              {branches.map((b, i) => (
                <button
                  key={b._id || b.name}
                  onClick={() => setActiveIdx(i)}
                  className={`block w-full rounded-xl px-5 py-4 text-left transition-colors ${
                    i === activeIdx
                      ? 'bg-brown-700 text-cream'
                      : 'border border-brown-100 text-brown-700 hover:border-orange-400 dark:border-brown-700 dark:text-cream'
                  }`}
                >
                  <span className="font-display text-sm font-bold">{b.name}</span>
                  <span className={`mt-1 block flex items-center gap-1.5 text-xs ${i === activeIdx ? 'text-cream/70' : 'text-brown-500 dark:text-cream/50'}`}>
                    <MapPin className="h-3 w-3 flex-shrink-0" /> {b.location}
                  </span>
                </button>
              ))}
            </div>
          </Reveal>

          {active && (
            <Reveal delay={2} key={active._id || active.name}>
              <div className="overflow-hidden rounded-2xl border border-brown-100 bg-white dark:border-brown-700 dark:bg-brown-800">
                {active.imageUrl && (
                  <img src={active.imageUrl} alt={active.name} className="h-56 w-full object-cover" />
                )}
                <div className="p-8">
                  <h2 className="font-display text-2xl font-bold text-brown-700 dark:text-cream">{active.name}</h2>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500" />
                      <p className="text-brown-600 dark:text-cream/70">{active.location}</p>
                    </div>
                    {active.pastorName && (
                      <div className="flex items-start gap-3">
                        <User className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500" />
                        <p className="text-brown-600 dark:text-cream/70">
                          <span className="eyebrow block text-[10px] text-brown-400 dark:text-cream/40">Pastor in Charge</span>
                          {active.pastorName}
                        </p>
                      </div>
                    )}
                    {active.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 flex-shrink-0 text-orange-500" />
                        <p className="text-brown-600 dark:text-cream/70">{active.phone}</p>
                      </div>
                    )}
                    {active.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 flex-shrink-0 text-orange-500" />
                        <p className="text-brown-600 dark:text-cream/70">{active.email}</p>
                      </div>
                    )}
                  </div>

                  {active.mapEmbedUrl && (
                    <div className="mt-8 overflow-hidden rounded-xl">
                      <iframe title={`Map for ${active.name}`} src={active.mapEmbedUrl} className="h-64 w-full" loading="lazy" />
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  )
}
