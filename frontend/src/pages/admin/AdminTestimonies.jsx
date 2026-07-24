import { useEffect, useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import { api } from '../../lib/api'
import { AdminHeader, Card, EmptyState, Loading, GhostButton, DangerButton } from './ui/primitives'

export default function AdminTestimonies() {
  const [testimonies, setTestimonies] = useState(null)
  const [error, setError] = useState('')

  const load = () => api.getAllTestimonies().then(setTestimonies).catch((err) => setError(err.message))

  useEffect(() => {
    load()
  }, [])

  const handleApprove = async (id) => {
    await api.approveTestimony(id)
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimony?')) return
    await api.deleteTestimony(id)
    load()
  }

  return (
    <>
      <AdminHeader title="Testimonies" subtitle="Approve submissions before they appear on the site" />
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      {!testimonies ? (
        <Loading />
      ) : testimonies.length === 0 ? (
        <EmptyState text="No testimonies yet." />
      ) : (
        <div className="space-y-4">
          {testimonies.map((t) => (
            <Card key={t._id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display font-bold text-brown-700 dark:text-cream">
                    {t.name}
                    {t.approved && (
                      <span className="ml-2 rounded-full bg-orange-400/15 px-2 py-0.5 text-[10px] text-orange-600">Live</span>
                    )}
                  </p>
                  {t.email && <p className="text-xs text-brown-500 dark:text-cream/50">{t.email}</p>}
                  <p className="mt-3 text-sm italic text-brown-600 dark:text-cream/80">&ldquo;{t.text}&rdquo;</p>
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  {!t.approved && (
                    <GhostButton onClick={() => handleApprove(t._id)}>
                      <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> Approve</span>
                    </GhostButton>
                  )}
                  <DangerButton onClick={() => handleDelete(t._id)}>
                    <span className="flex items-center gap-1.5"><Trash2 className="h-3.5 w-3.5" /> Delete</span>
                  </DangerButton>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
