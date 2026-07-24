import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { api } from '../../lib/api'
import { AdminHeader, Card, EmptyState, Loading, GhostButton } from './ui/primitives'

export default function AdminMessages() {
  const [messages, setMessages] = useState(null)
  const [error, setError] = useState('')

  const load = () => api.getMessages().then(setMessages).catch((err) => setError(err.message))

  useEffect(() => {
    load()
  }, [])

  const handleRead = async (id) => {
    await api.markMessageRead(id)
    load()
  }

  return (
    <>
      <AdminHeader title="Messages" subtitle="Submissions from the contact form" />
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      {!messages ? (
        <Loading />
      ) : messages.length === 0 ? (
        <EmptyState text="No messages yet." />
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <Card key={m._id} className={m.read ? 'opacity-60' : ''}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display font-bold text-brown-700 dark:text-cream">{m.name}</p>
                  <p className="text-xs text-brown-500 dark:text-cream/50">
                    {m.email}
                    {m.phone ? ` · ${m.phone}` : ''} · {new Date(m.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-3 text-sm text-brown-600 dark:text-cream/80">{m.message}</p>
                </div>
                {!m.read && (
                  <GhostButton onClick={() => handleRead(m._id)}>
                    <span className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5" /> Mark read
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
