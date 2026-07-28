import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  PlayCircle,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  X,
} from 'lucide-react'
import Reveal from '../components/Reveal'
import Counter from '../components/Counter'
import Countdown from '../components/Countdown'
import BibleVerse from '../components/BibleVerse'
import EventDateBadge from '../components/EventDateBadge'
import SermonCard from '../components/SermonCard'
import BankAccountCard from '../components/BankAccountCard'
import HomeGallerySlider from '../components/HomeGallerySlider'
import HomeTestimonialSlider from '../components/HomeTestimonialSlider'
import { api } from '../lib/api'
import { useApiData, useApiObject } from '../lib/useApiData'
import { getNextOccurrence, getNextProgrammeDate, formatProgrammeSchedule } from '../lib/nextOccurrence'
import {
  CHURCH,
  SERVICE_TIMES,
  EVENTS,
  TESTIMONIALS,
  GALLERY,
  LEADERS,
} from '../data/content'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Leaders />
      <ServiceTimes />
      <ThemeSection />
      <Sermons />
      <Events />
      <Gallery />
      <Testimonials />
      <BibleVerse />
      <Giving />
      <Contact />
    </>
  )
}

/* ---------------- Hero ---------------- */
const IDENTITY_FALLBACK = { churchName: CHURCH.name, slogan: CHURCH.slogan }

function Hero() {
  const { data: theme } = useApiObject(api.getSettings, THEME_FALLBACK)
  const { data: identity } = useApiObject(api.getSettings, IDENTITY_FALLBACK)

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-brown-800 via-brown-900 to-ink text-cream">
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-40 text-center">
        <h1 className="animate-rise mt-6 font-display text-4xl font-bold leading-tight sm:text-6xl" style={{ animationDelay: '0.15s' }}>
          Welcome to <span className="text-orange-200">{identity.churchName}</span>
        </h1>
        <div
          className="animate-rise mx-auto mt-8 inline-block border border-orange-400/40 px-6 py-3"
          style={{ animationDelay: '0.3s' }}
        >
          <p className="eyebrow text-xs text-cream/60">Theme of the Year - {theme.themeYear}</p>
          <p className="font-display text-xl font-bold tracking-wide text-orange-300 sm:text-2xl">
            {theme.themeTitle.toUpperCase()}
          </p>
        </div>

        <div className="animate-rise mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: '0.45s' }}>
          <Link
            to="/contact"
            className="group flex items-center gap-2 rounded-full bg-orange-400 px-8 py-4 eyebrow text-xs text-white transition-all hover:scale-105 hover:bg-orange-300"
          >
            Join Us This Sunday
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/sermons"
            className="group flex items-center gap-2 rounded-full border border-cream/30 px-8 py-4 eyebrow text-xs text-cream transition-all hover:scale-105 hover:border-orange-300 hover:text-orange-300"
          >
            <PlayCircle className="h-4 w-4" />
            Watch Messages
          </Link>
        </div>

        <p className="animate-rise mt-14 font-display text-base italic text-cream/70 sm:text-lg" style={{ animationDelay: '0.6s' }}>
          &ldquo;{identity.slogan}&rdquo;
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-cream/50">
        <div className="h-9 w-5 rounded-full border border-cream/40 p-1">
          <div className="mx-auto h-2 w-1 rounded-full bg-orange-300" />
        </div>
      </div>
    </section>
  )
}

/* ---------------- About ---------------- */
function About() {
  const ABOUT_FALLBACK = {
    aboutHeading: 'A Christ-Centered Family of Faith',
    aboutText: `${CHURCH.name} is a Christ-centered ministry committed to raising holy, Spirit-filled believers who passionately follow Jesus Christ and impact the world through the Gospel. Founded under the leadership of Rev. Dr. Chimaobi Aninwene, the church has grown from a small gathering into a thriving family of faith in Enugu, Nigeria, and beyond — committed to sound doctrine, fervent prayer, and radical love for God and people.`,
  }
  const { data: settings } = useApiObject(api.getSettings, ABOUT_FALLBACK)

  const stats = [
    { target: 25, suffix: '+', label: 'Years of Ministry' },
    { target: 10000, suffix: '+', label: 'Church Family' },
    { target: 25, suffix: '+', label: 'Active Branches' },
    { target: 40, suffix: '+', label: 'Communities Reached' },
  ]

  return (
    <section className="bg-cream py-24 dark:bg-brown-900">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="eyebrow text-xs text-brown-500">Who We Are</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-brown-700 dark:text-cream sm:text-4xl">
            {settings.aboutHeading}
          </h2>
          <p className="mt-6 leading-relaxed text-brown-600/90 dark:text-cream/70">
            {settings.aboutText}
          </p>
          <Link
            to="/about"
            className="mt-8 inline-flex items-center gap-2 border-b-2 border-orange-400 pb-1 eyebrow text-xs text-brown-600 transition-colors hover:text-orange-500 dark:text-cream"
          >
            Learn More About Us <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <Reveal delay={2} className="rounded-2xl bg-brown-800 p-10">
          <div className="grid grid-cols-2 gap-8">
            {stats.map((s) => (
              <Counter key={s.label} {...s} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------- Leaders ---------------- */
function Leaders() {
  const { data: leaders } = useApiData(api.getLeaders, LEADERS)

  return (
    <section className="bg-brown-50 py-24 dark:bg-brown-900">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="eyebrow text-xs text-brown-500">Leadership</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-brown-700 dark:text-cream sm:text-4xl">
            Meet Our Leaders
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-2">
          {leaders.map((leader, i) => (
            <Reveal key={leader._id || leader.name} delay={i + 1} className="h-full">
              <div className="card-hover-zoom group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-brown-800">
                <div className="h-72 flex-shrink-0 overflow-hidden">
                  <img src={leader.portraitUrl || leader.portrait} alt={leader.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-display text-xl font-bold text-brown-700 dark:text-cream">{leader.name}</h3>
                  <p className="eyebrow mt-1 text-[11px] text-orange-500">{leader.role}</p>
                  <p className="mt-4 text-sm leading-relaxed text-brown-600/80 dark:text-cream/70">{leader.bio}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Service Times ---------------- */
const SERVICE_TIMES_FALLBACK = {
  serviceTimes: SERVICE_TIMES,
  specialProgrammes: [
    { name: 'Redemption Night', weekOfMonth: 'Last', dayOfWeek: 'Friday', time: '9:00 PM', description: '' },
    { name: 'Thanksgiving Service', weekOfMonth: 'Last', dayOfWeek: 'Sunday', time: '9:00 AM', description: '' },
  ],
}

function ServiceTimes() {
  const { data } = useApiObject(api.getSettings, SERVICE_TIMES_FALLBACK)
  const { data: events } = useApiData(api.getEvents, [])

  const next = useMemo(
    () => getNextOccurrence({ serviceTimes: data.serviceTimes, specialProgrammes: data.specialProgrammes, events }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.serviceTimes, data.specialProgrammes, events]
  )

  return (
    <section className="bg-cream py-24 dark:bg-brown-900">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="eyebrow text-xs text-brown-500">Join Us</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-brown-700 dark:text-cream sm:text-4xl">
            Service Times
          </h2>
        </Reveal>

        {next && (
          <Reveal delay={1} className="mt-12 overflow-hidden rounded-2xl bg-brown-700 px-6 py-10 text-center">
            <p className="eyebrow text-[11px] text-orange-300">Coming Up Next</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-cream sm:text-3xl">{next.label}</h3>
            <div className="mt-8">
              <Countdown target={next.date} />
            </div>
          </Reveal>
        )}

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-6 text-xs text-brown-500 dark:text-cream/50">Weekly Services</p>
            <div className="space-y-8 border-l-2 border-orange-400/30 pl-6">
              {data.serviceTimes.map((block, i) => (
                <Reveal key={block.day} delay={(i % 3) + 1} className="relative">
                  <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-orange-400 bg-cream dark:bg-brown-900" />
                  <h3 className="font-display text-lg font-bold text-brown-700 dark:text-cream">{block.day}</h3>
                  <ul className="mt-3 space-y-2">
                    {block.items.map((item) => (
                      <li key={item.name} className="flex items-center justify-between gap-4 text-sm">
                        <span className="text-brown-600 dark:text-cream/80">{item.name}</span>
                        <span className="flex items-center gap-1.5 eyebrow text-xs text-orange-500">
                          <Clock className="h-3.5 w-3.5" /> {item.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>

          {data.specialProgrammes.length > 0 && (
            <div>
              <p className="eyebrow mb-6 text-xs text-brown-500 dark:text-cream/50">Special Programmes</p>
              <div className="space-y-4">
                {[...data.specialProgrammes]
                  .sort((a, b) => (getNextProgrammeDate(a) ?? Infinity) - (getNextProgrammeDate(b) ?? Infinity))
                  .map((programme) => (
                  <Reveal key={programme.name} className="rounded-2xl border border-orange-400/40 bg-orange-400/20 p-6">
                    <h3 className="font-display text-lg font-bold text-brown-700 dark:text-cream">{programme.name}</h3>
                    <p className="mt-1 eyebrow text-xs text-orange-600 dark:text-orange-300">
                      {formatProgrammeSchedule(programme)}
                    </p>
                    {programme.description && (
                      <p className="mt-3 text-sm text-brown-600/90 dark:text-cream/70">{programme.description}</p>
                    )}
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Theme of the Year (+ Month, merged) ---------------- */
const THEME_FALLBACK = {
  themeYear: '2026',
  themeTitle: CHURCH.theme2026,
  themeDescription: 'This year, we press forward with singleness of heart, laying aside every weight and distraction to run the race set before us with our eyes fixed on Jesus.',
  themeMonthLabel: '',
  themeMonthTitle: '',
  themeMonthDescription: '',
}

function ThemeSection() {
  const { data } = useApiObject(api.getSettings, THEME_FALLBACK)

  return (
    <section className="relative bg-brown-800 py-28 text-center text-cream">
      <Reveal className="relative mx-auto max-w-2xl px-6">
        <p className="eyebrow text-xs text-orange-300">Theme of the Year - {data.themeYear}</p>
        <h2 className="text-gradient-orange mt-4 font-display text-5xl font-bold sm:text-6xl">
          {data.themeTitle.toUpperCase()}
        </h2>
        <p className="mt-6 text-cream/70">{data.themeDescription}</p>
        <div className="mx-auto mt-10 h-px w-24 bg-orange-400/50" />

        {data.themeMonthTitle && (
          <div className="mt-6">
            <p className="eyebrow text-[10px] text-orange-200/80">
              Theme of the Month{data.themeMonthLabel ? ` — ${data.themeMonthLabel}` : ''}
            </p>
            <h3 className="mt-2 font-display text-lg font-bold text-cream/90">{data.themeMonthTitle}</h3>
            {data.themeMonthDescription && (
              <p className="mx-auto mt-2 max-w-md text-xs text-cream/60">{data.themeMonthDescription}</p>
            )}
          </div>
        )}
      </Reveal>
    </section>
  )
}

/* ---------------- Sermons ---------------- */
function Sermons() {
  const { data: sermons } = useApiData(api.getSermons, [])

  return (
    <section className="bg-cream py-24 dark:bg-brown-900">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-xs text-brown-500">The Word</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-brown-700 dark:text-cream sm:text-4xl">
              Recent Sermons
            </h2>
          </div>
          {sermons.length > 0 && (
            <Link to="/sermons" className="eyebrow flex items-center gap-2 text-xs text-orange-500 hover:text-orange-600">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </Reveal>

        {sermons.length === 0 ? (
          <p className="mt-12 text-center text-sm text-brown-500 dark:text-cream/50">
            Sermons will appear here once they're added.
          </p>
        ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sermons.slice(0, 3).map((s, i) => (
            <Reveal key={s._id || s.title} delay={i + 1}>
              <SermonCard sermon={s} index={i} />
            </Reveal>
          ))}
        </div>
        )}
      </div>
    </section>
  )
}

/* ---------------- Events ---------------- */
function Events() {
  const { data: events } = useApiData(api.getEvents, EVENTS)

  return (
    <section className="bg-brown-50 py-24 dark:bg-brown-900">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="eyebrow text-xs text-brown-500">Mark Your Calendar</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-brown-700 dark:text-cream sm:text-4xl">
            Upcoming Events
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {events.map((e, i) => (
            <Reveal key={e._id || e.title} delay={(i % 2) + 1}>
              <div className="flex items-center gap-6 rounded-2xl border border-brown-100 bg-white p-6 transition-shadow hover:shadow-lg dark:border-brown-700 dark:bg-brown-800">
                <EventDateBadge date={e.date} dateLabel={e.dateLabel} />
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-brown-700 dark:text-cream">{e.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-brown-500 dark:text-cream/60">
                    {e.time && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {e.time}</span>}
                    {e.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {e.location}</span>}
                  </div>
                </div>
                <Link
                  to={e._id ? `/events/${e._id}/register` : '/contact'}
                  className="flex-shrink-0 rounded-full bg-orange-400 px-4 py-2 eyebrow text-[10px] text-white transition-transform hover:scale-105"
                >
                  Register
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Gallery ---------------- */
function Gallery() {
  const [active, setActive] = useState(null)
  const { data: images } = useApiData(api.getGallery, GALLERY)

  return (
    <section className="bg-cream py-24 dark:bg-brown-900">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="eyebrow text-xs text-brown-500">Moments</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-brown-700 dark:text-cream sm:text-4xl">Gallery</h2>
        </Reveal>

        <Reveal delay={1} className="mt-12">
          <HomeGallerySlider images={images} intervalMs={4000} onSelect={setActive} />
        </Reveal>

        <div className="mt-10 text-center">
          <Link to="/gallery" className="eyebrow text-xs text-orange-500 hover:text-orange-600">
            Browse Full Gallery by Category →
          </Link>
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-6"
          onClick={() => setActive(null)}
        >
          <button className="absolute right-6 top-6 text-cream hover:text-orange-400" aria-label="Close">
            <X className="h-7 w-7" />
          </button>
          <img src={active} alt="Enlarged gallery" className="max-h-[85vh] max-w-full rounded-xl object-contain" />
        </div>
      )}
    </section>
  )
}

/* ---------------- Testimonials ---------------- */
function Testimonials() {
  const { data: testimonials } = useApiData(api.getTestimonies, TESTIMONIALS)

  return (
    <section className="bg-brown-50 py-24 dark:bg-brown-900">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="eyebrow text-xs text-brown-500">Testimonies</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-brown-700 dark:text-cream sm:text-4xl">
            What Our Members Say
          </h2>
        </Reveal>

        <Reveal delay={2}>
          <HomeTestimonialSlider testimonials={testimonials} intervalMs={5000} />
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------- Giving ---------------- */
const GIVING_FALLBACK = {
  bankAccounts: [
    { label: 'Tithe', bankName: CHURCH.bank.bankName, accountName: CHURCH.bank.accountName, accountNumber: CHURCH.bank.accountNumber },
    { label: 'Project', bankName: CHURCH.bank.bankName, accountName: CHURCH.bank.accountName, accountNumber: CHURCH.bank.accountNumber },
    { label: 'Mission', bankName: CHURCH.bank.bankName, accountName: CHURCH.bank.accountName, accountNumber: CHURCH.bank.accountNumber },
    { label: 'Alms (Helping the Poor)', bankName: CHURCH.bank.bankName, accountName: CHURCH.bank.accountName, accountNumber: CHURCH.bank.accountNumber },
  ],
}

function Giving() {
  const { data } = useApiObject(api.getSettings, GIVING_FALLBACK)

  return (
    <section className="bg-cream py-24 dark:bg-brown-900">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal className="text-center">
          <p className="eyebrow text-xs text-brown-500">Sow a Seed</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-brown-700 dark:text-cream sm:text-4xl">Giving</h2>
          <p className="mx-auto mt-4 max-w-lg text-brown-600/80 dark:text-cream/70">
            &ldquo;Give, and it will be given to you.&rdquo; Your giving sustains the work of the
            Gospel here and around the world.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {data.bankAccounts.map((account, i) => (
            <Reveal key={account.accountNumber || i} delay={(i % 4) + 1}>
              <BankAccountCard account={account} />
            </Reveal>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/give" className="inline-block rounded-full bg-orange-400 px-8 py-4 eyebrow text-xs text-white transition-transform hover:scale-105">
            Give Online
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Contact ---------------- */
const CONTACT_FALLBACK = {
  address: `${CHURCH.name}, ${CHURCH.address.join(', ')}`,
  phone: CHURCH.phone,
  email: CHURCH.email,
  mapEmbedUrl: 'https://www.google.com/maps?q=Enugu%2C%20Nigeria&output=embed',
}

function Contact() {
  const { data: settings } = useApiObject(api.getSettings, CONTACT_FALLBACK)

  return (
    <section className="bg-brown-50 py-24 dark:bg-brown-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow text-xs text-brown-500">Visit Us</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-brown-700 dark:text-cream sm:text-4xl">Get in Touch</h2>
          <div className="mt-8 space-y-5">
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-orange-500" />
              <p className="text-brown-600 dark:text-cream/70">{settings.address}</p>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-5 w-5 flex-shrink-0 text-orange-500" />
              <p className="text-brown-600 dark:text-cream/70">{settings.phone}</p>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 flex-shrink-0 text-orange-500" />
              <p className="text-brown-600 dark:text-cream/70">{settings.email}</p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-orange-400/30 bg-orange-400/10 p-5">
            <p className="text-sm text-brown-700 dark:text-cream">
              Need prayer? <Link to="/prayer-request" className="font-semibold text-orange-600 underline hover:text-orange-500 dark:text-orange-300">Submit a prayer request</Link> and our prayer team will stand with you.
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-brown-200 bg-white p-5 dark:border-brown-700 dark:bg-brown-800">
            <p className="text-sm text-brown-700 dark:text-cream">
              Looking for a branch near you? <Link to="/branches" className="font-semibold text-orange-600 underline hover:text-orange-500 dark:text-orange-300">Find a location</Link>.
            </p>
          </div>
        </Reveal>

        <Reveal delay={2} className="overflow-hidden rounded-2xl border border-brown-100 shadow-lg dark:border-brown-700">
          <iframe
            title="Church location map"
            src={settings.mapEmbedUrl}
            className="h-80 w-full lg:h-full"
            loading="lazy"
          />
        </Reveal>
      </div>
    </section>
  )
}
