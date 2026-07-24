import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { AdminHeader, Card, EmptyState, Loading } from './ui/primitives'

export default function AdminEventRegistrations() {
  const [registrations, setRegistrations] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getAllEventRegistrations().then(setRegistrations).catch((err) => setError(err.message))
  }, [])

  return (
    <>
      <AdminHeader title="Event Registrations" subtitle="Everyone who has registered for an event" />
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      {!registrations ? (
        <Loading />
      ) : registrations.length === 0 ? (
        <EmptyState text="No one has registered for an event yet." />
      ) : (
        <div className="space-y-4">
          {registrations.map((r) => (
            <Card key={r._id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display font-bold text-brown-700 dark:text-cream">{r.name}</p>
                  <p className="text-xs text-brown-500 dark:text-cream/50">
                    {r.email}
                    {r.phone ? ` · ${r.phone}` : ''} · {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="eyebrow rounded-full bg-orange-400/15 px-3 py-1 text-[10px] text-orange-600 dark:text-orange-300">
                  {r.eventTitle}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
