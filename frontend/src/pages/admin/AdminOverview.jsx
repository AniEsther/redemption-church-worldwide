import { useEffect, useState } from 'react'
import { Mail, HandHeart, Users, Mic2, CalendarDays, Quote, HeartHandshake, UserCog, Images, Building2 } from 'lucide-react'
import { api } from '../../lib/api'
import { AdminHeader, Card, Loading } from './ui/primitives'

const STAT_CONFIG = [
  { key: 'messages', label: 'Messages', icon: Mail, fetcher: api.getMessages },
  { key: 'prayers', label: 'Prayer Requests', icon: HandHeart, fetcher: api.getPrayerRequests },
  { key: 'subscribers', label: 'Subscribers', icon: Users, fetcher: api.getSubscribers },
  { key: 'sermons', label: 'Sermons', icon: Mic2, fetcher: api.getSermons },
  { key: 'events', label: 'Events', icon: CalendarDays, fetcher: api.getEvents },
  { key: 'ministries', label: 'Ministries', icon: HeartHandshake, fetcher: api.getMinistries },
  { key: 'pastors', label: 'Pastors', icon: UserCog, fetcher: api.getLeaders },
  { key: 'branches', label: 'Branches', icon: Building2, fetcher: api.getBranches },
  { key: 'gallery', label: 'Gallery Images', icon: Images, fetcher: api.getGallery },
  { key: 'testimonies', label: 'Testimonies (pending)', icon: Quote, fetcher: api.getAllTestimonies },
]

export default function AdminOverview() {
  const [counts, setCounts] = useState(null)

  useEffect(() => {
    Promise.all(STAT_CONFIG.map((s) => s.fetcher().catch(() => [])))
      .then((results) => {
        const next = {}
        STAT_CONFIG.forEach((s, i) => {
          if (s.key === 'testimonies') {
            next[s.key] = results[i].filter((t) => !t.approved).length
          } else {
            next[s.key] = results[i].length
          }
        })
        setCounts(next)
      })
  }, [])

  return (
    <>
      <AdminHeader title="Overview" subtitle="A snapshot of what's happening on the site" />
      {!counts ? (
        <Loading />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STAT_CONFIG.map(({ key, label, icon: Icon }) => (
            <Card key={key} className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-400/15 text-orange-500">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-brown-700 dark:text-cream">{counts[key]}</p>
                <p className="text-xs text-brown-500 dark:text-cream/60">{label}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
