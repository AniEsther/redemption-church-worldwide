import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { User, Clock, MapPin, Phone, Mail, ArrowLeft, ArrowRight, CalendarDays } from 'lucide-react'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { api } from '../lib/api'

export default function MinistryActivities() {
  const { id } = useParams()
  const [ministry, setMinistry] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    api
      .getMinistry(id)
      .then(setMinistry)
      .catch(() => setNotFound(true))
  }, [id])

  useEffect(() => {
    if (!ministry?.galleryCategory) return
    api
      .getGallery()
      .then((images) => setPhotos(images.filter((img) => img.category === ministry.galleryCategory)))
      .catch(() => {})
  }, [ministry])

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

  const infoItems = [
    { icon: User, label: 'Contact Person', value: ministry.leaderName },
    { icon: Phone, label: 'Contact Number', value: ministry.contactPhone },
    { icon: Mail, label: 'Contact Email', value: ministry.contactEmail },
    { icon: Clock, label: 'Meeting Time', value: ministry.meetingTime },
    { icon: MapPin, label: 'Meeting Location', value: ministry.meetingLocation },
  ].filter((item) => item.value)

  return (
    <>
      <PageHero eyebrow={ministry.name} title="Ministry Details" />

      <section className="bg-cream py-24 dark:bg-brown-900">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <Link to={`/ministries/${ministry._id}`} className="eyebrow inline-flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to {ministry.name}
            </Link>
          </Reveal>

          {infoItems.length > 0 && (
            <Reveal delay={2} className="mt-6 grid gap-4 rounded-xl border border-brown-100 bg-white p-6 dark:border-brown-700 dark:bg-brown-800 sm:grid-cols-2">
              {infoItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <item.icon className="h-4 w-4 flex-shrink-0 text-orange-500" />
                  <div>
                    <p className="eyebrow text-[10px] text-brown-400 dark:text-cream/40">{item.label}</p>
                    <p className="text-sm text-brown-700 dark:text-cream">{item.value}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          )}

          {ministry.yearlyActivities && (
            <Reveal delay={3} className="mt-8">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-brown-700 dark:text-cream">
                <CalendarDays className="h-5 w-5 text-orange-500" /> Yearly Activities
              </h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-brown-600/90 dark:text-cream/70">
                {ministry.yearlyActivities}
              </p>
            </Reveal>
          )}

          {ministry.howToJoin && (
            <Reveal delay={4} className="mt-8 rounded-xl border border-orange-400/30 bg-orange-400/10 p-6">
              <h2 className="font-display text-lg font-bold text-brown-700 dark:text-cream">How to Join</h2>
              <p className="mt-3 leading-relaxed text-brown-700/90 dark:text-cream/80">{ministry.howToJoin}</p>
              <Link
                to="/contact"
                className="mt-4 inline-flex items-center gap-1.5 eyebrow text-xs text-orange-600 hover:text-orange-700"
              >
                Reach Out to Get Involved <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Reveal>
          )}

          {photos.length > 0 && (
            <Reveal delay={5} className="mt-12">
              <h2 className="font-display text-lg font-bold text-brown-700 dark:text-cream">More Photos</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {photos.map((img) => (
                  <div key={img._id} className="aspect-square overflow-hidden rounded-xl">
                    <img src={img.imageUrl} alt={img.caption || ministry.name} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  )
}
