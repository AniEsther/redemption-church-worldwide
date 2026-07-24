import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import SermonCard from '../components/SermonCard'
import { api } from '../lib/api'
import { useApiData } from '../lib/useApiData'

const TYPES = ['All', 'Videos', 'Audio']

export default function Sermons() {
  const { data: sermons } = useApiData(api.getSermons, [])
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState('All')
  const [type, setType] = useState('All')

  const topics = useMemo(() => {
    const set = new Set(sermons.filter((s) => s.topic).map((s) => s.topic))
    return ['All', ...Array.from(set)]
  }, [sermons])

  const filtered = sermons.filter((s) => {
    const matchesTopic = topic === 'All' || s.topic === topic
    const matchesType = type === 'All' || (type === 'Videos' ? Boolean(s.videoUrl) : Boolean(s.audioUrl))
    const q = query.trim().toLowerCase()
    const matchesQuery =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.speaker.toLowerCase().includes(q) ||
      (s.topic || '').toLowerCase().includes(q)
    return matchesTopic && matchesType && matchesQuery
  })

  return (
    <>
      <PageHero eyebrow="The Word" title="Sermons" subtitle="Watch, listen, and download messages from our services" />

      <section className="bg-cream py-24 dark:bg-brown-900">
        <div className="mx-auto max-w-6xl px-6">
          {sermons.length === 0 ? (
            <p className="text-center text-sm text-brown-500 dark:text-cream/50">
              Sermons will appear here once they're added.
            </p>
          ) : (
            <>
              <Reveal className="mx-auto max-w-md">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brown-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search sermons by title, speaker, or topic"
                    className="w-full rounded-full border border-brown-200 bg-white py-3 pl-11 pr-4 text-sm focus:border-orange-400 dark:border-brown-700 dark:bg-brown-800"
                  />
                </div>
              </Reveal>

              <Reveal className="mt-6 flex flex-wrap justify-center gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`rounded-full border px-5 py-2 eyebrow text-[11px] transition-colors ${
                      type === t
                        ? 'border-brown-700 bg-brown-700 text-white dark:border-orange-400 dark:bg-orange-400'
                        : 'border-brown-200 text-brown-600 hover:border-brown-400 dark:border-brown-600 dark:text-cream/70'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </Reveal>

              {topics.length > 1 && (
                <Reveal className="mt-3 flex flex-wrap justify-center gap-2">
                  {topics.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`rounded-full border px-4 py-1.5 eyebrow text-[10px] transition-colors ${
                        topic === t
                          ? 'border-orange-400 bg-orange-400 text-white'
                          : 'border-brown-200 text-brown-500 hover:border-orange-400 hover:text-orange-500 dark:border-brown-600 dark:text-cream/60'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </Reveal>
              )}

              {filtered.length === 0 ? (
                <p className="mt-16 text-center text-sm text-brown-500 dark:text-cream/50">
                  No sermons match your search.
                </p>
              ) : (
                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((s, i) => (
                    <Reveal key={s._id || s.title} delay={(i % 3) + 1}>
                      <SermonCard sermon={s} index={i} />
                    </Reveal>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
