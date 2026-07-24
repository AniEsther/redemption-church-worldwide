import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { api } from '../lib/api'
import { useApiData } from '../lib/useApiData'
import { LEADERS } from '../data/content'

export default function Pastors() {
  const { data: leaders } = useApiData(api.getLeaders, LEADERS)

  return (
    <>
      <PageHero eyebrow="Leadership" title="Our Pastors" subtitle="Shepherding the flock with grace and truth" />

      <section className="bg-cream py-24 dark:bg-brown-900">
        <div className="mx-auto max-w-5xl space-y-16 px-6">
          {leaders.map((leader, i) => (
            <Reveal key={leader._id || leader.name} delay={i + 1}>
              <div className={`flex flex-col items-center gap-10 sm:flex-row ${i % 2 === 1 ? 'sm:flex-row-reverse' : ''}`}>
                <img
                  src={leader.portraitUrl || leader.portrait}
                  alt={leader.name}
                  className="h-64 w-64 flex-shrink-0 rounded-2xl object-cover shadow-lg"
                />
                <div>
                  <h2 className="font-display text-2xl font-bold text-brown-700 dark:text-cream">{leader.name}</h2>
                  <p className="eyebrow mt-1 text-xs text-orange-500">{leader.role}</p>
                  <p className="mt-4 leading-relaxed text-brown-600/80 dark:text-cream/70">{leader.bio}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
