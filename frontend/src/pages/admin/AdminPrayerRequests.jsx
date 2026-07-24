import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { api } from '../../lib/api'
import { AdminHeader, Card, EmptyState, Loading, GhostButton } from './ui/primitives'

export default function AdminPrayerRequests() {
  const [requests, setRequests] = useState(null)
  const [error, setError] = useState('')

  const load = () => api.getPrayerRequests().then(setRequests).catch((err) => setError(err.message))

  useEffect(() => {
    load()
  }, [])

  const handlePrayed = async (id) => {
    await api.markPrayed(id)
    load()
  }

  return (
    <>
      <AdminHeader title="Prayer Requests" subtitle="Submissions from the prayer request form" />
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      {!requests ? (
        <Loading />
      ) : requests.length === 0 ? (
        <EmptyState text="No prayer requests yet." />
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <Card key={r._id} className={r.prayedFor ? 'opacity-60' : ''}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display font-bold text-brown-700 dark:text-cream">
                    {r.name} <span className="ml-2 rounded-full bg-orange-400/15 px-2 py-0.5 text-[10px] text-orange-600">{r.category}</span>
                  </p>
                  <p className="text-xs text-brown-500 dark:text-cream/50">
                    {r.email} · {new Date(r.createdAt).toLocaleString()}
                    {r.confidential ? ' · Confidential' : ''}
                  </p>
                  <p className="mt-3 text-sm text-brown-600 dark:text-cream/80">{r.request}</p>
                </div>
                {!r.prayedFor && (
                  <GhostButton onClick={() => handlePrayed(r._id)}>
                    <span className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5" /> Prayed for
                    </span>
                  </GhostButton>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
