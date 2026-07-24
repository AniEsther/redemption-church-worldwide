import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { api } from '../lib/api'

export default function MinistryDetail() {
  const { id } = useParams()
  const [ministry, setMinistry] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api
      .getMinistry(id)
      .then(setMinistry)
      .catch(() => setNotFound(true))
  }, [id])

  if (notFound) {
    return (
      <>
        <PageHero eyebrow="Ministries" title="Ministry Not Found" />
        <section className="bg-cream py-24 text-center dark:bg-brown-900">
          <p className="text-brown-600 dark:text-cream/70">
            This ministry may have been removed. <Link to="/ministries" className="text-orange-500 underline">See all ministries</Link>.
          </p>
        </section>
      </>
    )
  }

  if (!ministry) {
    return (
      <section className="bg-cream py-40 text-center dark:bg-brown-900">
        <p className="text-sm text-brown-500 dark:text-cream/50">Loading…</p>
      </section>
    )
  }

  const hasMore = ministry.yearlyActivities || ministry.howToJoin || ministry.contactPhone || ministry.galleryCategory

  return (
    <>
      <PageHero eyebrow="Ministries" title={ministry.name} />

      <section className="bg-cream py-24 dark:bg-brown-900">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <Link to="/ministries" className="eyebrow inline-flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600">
              <ArrowLeft className="h-3.5 w-3.5" /> All Ministries
            </Link>
          </Reveal>

          {ministry.imageUrl && (
            <Reveal delay={2}>
              <img
                src={ministry.imageUrl}
                alt={ministry.name}
                className="mt-6 h-72 w-full rounded-2xl object-cover"
              />
            </Reveal>
          )}

          <Reveal delay={3} className="mt-8">
            <h2 className="font-display text-lg font-bold text-brown-700 dark:text-cream">About This Ministry</h2>
            <p className="mt-3 leading-relaxed text-brown-600/90 dark:text-cream/70">{ministry.description}</p>
          </Reveal>

          {ministry.details && (
            <Reveal delay={4} className="mt-8">
              <h2 className="font-display text-lg font-bold text-brown-700 dark:text-cream">What We Do</h2>
              <p className="mt-3 leading-relaxed text-brown-600/90 dark:text-cream/70">{ministry.details}</p>
            </Reveal>
          )}

          {hasMore && (
            <Reveal delay={5} className="mt-10">
              <Link
                to={`/ministries/${ministry._id}/details`}
                className="inline-flex items-center gap-2 rounded-full bg-orange-400 px-8 py-4 eyebrow text-xs text-white transition-transform hover:scale-105"
              >
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          )}
        </div>
      </section>
    </>
  )
}
