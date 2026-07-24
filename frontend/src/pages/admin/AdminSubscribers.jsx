import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { AdminHeader, Card, EmptyState, Loading } from './ui/primitives'

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getSubscribers().then(setSubscribers).catch((err) => setError(err.message))
  }, [])

  return (
    <>
      <AdminHeader title="Subscribers" subtitle="Newsletter signups from the site footer" />
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      {!subscribers ? (
        <Loading />
      ) : subscribers.length === 0 ? (
        <EmptyState text="No subscribers yet." />
      ) : (
        <Card>
          <ul className="divide-y divide-brown-100 dark:divide-brown-700">
            {subscribers.map((s) => (
              <li key={s._id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-brown-700 dark:text-cream">{s.email}</span>
                <span className="text-xs text-brown-400 dark:text-cream/40">{new Date(s.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  )
}
