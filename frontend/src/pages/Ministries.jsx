import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { MINISTRIES } from '../data/content'
import { api } from '../lib/api'
import { useApiData } from '../lib/useApiData'

export default function Ministries() {
  const { data: ministries } = useApiData(api.getMinistries, MINISTRIES)

  return (
    <>
      <PageHero eyebrow="Serve With Us" title="Ministries" subtitle="Find your place to serve and grow" />

      <section className="bg-cream py-24 dark:bg-brown-900">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((m, i) => {
            const card = (
              <div className="group h-full overflow-hidden rounded-2xl border border-brown-100 bg-white transition-all hover:-translate-y-1 hover:shadow-xl dark:border-brown-700 dark:bg-brown-800">
                {m.imageUrl && (
                  <div className="h-40 overflow-hidden">
                    <img src={m.imageUrl} alt={m.name} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-200 font-display text-lg font-bold text-orange-600 transition-colors group-hover:bg-orange-400 group-hover:text-white">
                    {m.name.charAt(0)}
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-brown-700 dark:text-cream">{m.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brown-600/80 dark:text-cream/70">{m.desc || m.description}</p>
                  {m._id && (
                    <p className="mt-4 eyebrow text-[10px] text-orange-500 group-hover:text-orange-600">View Details →</p>
                  )}
                </div>
              </div>
            )
            return (
              <Reveal key={m._id || m.name} delay={(i % 3) + 1}>
                {m._id ? <Link to={`/ministries/${m._id}`}>{card}</Link> : card}
              </Reveal>
            )
          })}
        </div>
      </section>
    </>
  )
}
