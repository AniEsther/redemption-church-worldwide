import { Clock, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import EventDateBadge from '../components/EventDateBadge'
import { EVENTS } from '../data/content'
import { api } from '../lib/api'
import { useApiData, useApiObject, formatDate } from '../lib/useApiData'
import { formatProgrammeSchedule, getNextProgrammeDate } from '../lib/nextOccurrence'

const PROGRAMMES_FALLBACK = { specialProgrammes: [] }

export default function Events() {
  const { data: events } = useApiData(api.getEvents, EVENTS)
  const { data: settings } = useApiObject(api.getSettings, PROGRAMMES_FALLBACK)

  const sortedProgrammes = [...settings.specialProgrammes].sort(
    (a, b) => (getNextProgrammeDate(a) ?? Infinity) - (getNextProgrammeDate(b) ?? Infinity)
  )

  return (
    <>
      <PageHero eyebrow="Mark Your Calendar" title="Events" subtitle="Gatherings, conferences, and programs to be part of" />

      <section className="bg-cream py-24 dark:bg-brown-900">
        <div className="mx-auto max-w-5xl px-6">
          {sortedProgrammes.length > 0 && (
            <Reveal className="mb-14">
              <p className="eyebrow mb-4 text-xs text-brown-500 dark:text-cream/50">Special Programmes</p>
              <div className="grid gap-6 sm:grid-cols-2">
                {sortedProgrammes.map((programme) => (
                  <div key={programme.name} className="rounded-2xl border border-orange-400/40 bg-orange-400/20 p-6">
                    <h3 className="font-display text-lg font-bold text-brown-700 dark:text-cream">{programme.name}</h3>
                    <p className="mt-1 eyebrow text-xs text-orange-600 dark:text-orange-300">
                      {formatProgrammeSchedule(programme)}
                    </p>
                    {programme.description && (
                      <p className="mt-3 text-sm text-brown-600/90 dark:text-cream/70">{programme.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {events.length > 0 && (
            <>
              <p className="eyebrow mb-4 text-xs text-brown-500 dark:text-cream/50">Upcoming Events</p>
              <div className="grid gap-6 lg:grid-cols-2">
                {events.map((e, i) => (
                  <Reveal key={e._id || e.title} delay={(i % 2) + 1}>
                    <div className="flex items-center gap-6 rounded-2xl border border-brown-100 bg-white p-6 transition-shadow hover:shadow-lg dark:border-brown-700 dark:bg-brown-800">
                      <EventDateBadge date={e.date} dateLabel={e.dateLabel} />
                      <div className="flex-1">
                        <h3 className="font-display text-lg font-bold text-brown-700 dark:text-cream">{e.title}</h3>
                        <p className="mt-1 text-xs text-orange-500">{e.dateLabel || formatDate(e.date)}</p>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-brown-500 dark:text-cream/60">
                          {e.time && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {e.time}</span>}
                          {e.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {e.location}</span>}
                        </div>
                      </div>
                      {e._id ? (
                        <Link
                          to={`/events/${e._id}/register`}
                          className="flex-shrink-0 rounded-full bg-orange-400 px-4 py-2 eyebrow text-[10px] text-white transition-transform hover:scale-105"
                        >
                          Register
                        </Link>
                      ) : (
                        <Link
                          to="/contact"
                          className="flex-shrink-0 rounded-full bg-orange-400 px-4 py-2 eyebrow text-[10px] text-white transition-transform hover:scale-105"
                        >
                          Register
                        </Link>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
