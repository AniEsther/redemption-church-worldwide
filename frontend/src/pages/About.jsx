import { Compass, Heart, Target } from 'lucide-react'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { CHURCH } from '../data/content'
import { api } from '../lib/api'
import { useApiObject } from '../lib/useApiData'

const FALLBACK = {
  aboutText: `${CHURCH.name} is a Christ-centered ministry committed to raising holy, Spirit-filled believers who passionately follow Jesus Christ and impact the world through the Gospel. Founded under the leadership of Rev. Dr. Chimaobi Aninwene, the church has grown from a small gathering into a thriving family of faith in Enugu, Nigeria, and beyond — committed to sound doctrine, fervent prayer, and radical love for God and people.`,
  visionText: 'To raise a global community of holy, Spirit-filled believers passionately following Jesus Christ.',
  missionText: 'To preach the undiluted Word of God, disciple believers, and impact the world through the Gospel.',
  valuesText: 'Holiness, love, integrity, prayerfulness, and undistracted focus on the person of Jesus Christ.',
}

export default function About() {
  const { data: settings } = useApiObject(api.getSettings, FALLBACK)

  const VALUES = [
    { icon: Compass, title: 'Our Vision', text: settings.visionText },
    { icon: Target, title: 'Our Mission', text: settings.missionText },
    { icon: Heart, title: 'Our Values', text: settings.valuesText },
  ]

  return (
    <>
      <PageHero eyebrow="Our Story" title="About Us" subtitle={CHURCH.slogan} />

      <section className="bg-cream py-24 dark:bg-brown-900">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <p className="leading-relaxed text-brown-600/90 dark:text-cream/70">{settings.aboutText}</p>
          </Reveal>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-8 px-6 sm:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i + 1}>
              <div className="h-full rounded-2xl border border-brown-100 bg-white p-8 text-center dark:border-brown-700 dark:bg-brown-800">
                <v.icon className="mx-auto h-8 w-8 text-orange-500" />
                <h3 className="mt-4 font-display text-lg font-bold text-brown-700 dark:text-cream">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brown-600/80 dark:text-cream/70">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
