import { useEffect, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { api } from '../../lib/api'
import { AdminHeader, Card, EmptyState, Loading, Field, inputClass, PrimaryButton, GhostButton, DangerButton } from './ui/primitives'
import UploadField from './ui/UploadField'

const EMPTY = {
  name: '',
  description: '',
  details: '',
  yearlyActivities: '',
  leaderName: '',
  meetingTime: '',
  meetingLocation: '',
  contactPhone: '',
  contactEmail: '',
  howToJoin: '',
  galleryCategory: '',
  imageUrl: '',
  order: 0,
}

export default function AdminMinistries() {
  const [ministries, setMinistries] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => api.getMinistries().then(setMinistries).catch((err) => setError(err.message))

  useEffect(() => {
    load()
  }, [])

  const set = (key) => (v) => setForm((f) => ({ ...f, [key]: typeof v === 'string' ? v : v.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (editingId) {
        await api.updateMinistry(editingId, form)
      } else {
        await api.createMinistry(form)
      }
      setForm(EMPTY)
      setEditingId(null)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (m) => {
    setEditingId(m._id)
    setForm({
      name: m.name,
      description: m.description,
      details: m.details || '',
      yearlyActivities: m.yearlyActivities || '',
      leaderName: m.leaderName || '',
      meetingTime: m.meetingTime || '',
      meetingLocation: m.meetingLocation || '',
      contactPhone: m.contactPhone || '',
      contactEmail: m.contactEmail || '',
      howToJoin: m.howToJoin || '',
      galleryCategory: m.galleryCategory || '',
      imageUrl: m.imageUrl || '',
      order: m.order ?? 0,
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this ministry?')) return
    await api.deleteMinistry(id)
    load()
  }

  return (
    <>
      <AdminHeader title="Ministries" subtitle="Manage programs and ministries shown on the site" />

      <Card className="mb-8">
        <h2 className="mb-4 font-display font-bold text-brown-700 dark:text-cream">
          {editingId ? 'Edit Ministry' : 'Add a Ministry'}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input required value={form.name} onChange={set('name')} className={inputClass} />
          </Field>
          <UploadField label="Image (optional)" value={form.imageUrl} onChange={set('imageUrl')} accept="image/*" />
          <div className="sm:col-span-2">
            <Field label="Short Description (shown on cards)">
              <textarea required rows={2} value={form.description} onChange={set('description')} className={inputClass} />
            </Field>
          </div>
          <Field label="Ministry Leader (optional)">
            <input value={form.leaderName} onChange={set('leaderName')} className={inputClass} />
          </Field>
          <Field label="Meeting Time (optional)">
            <input value={form.meetingTime} onChange={set('meetingTime')} placeholder="e.g. Saturdays, 4:00 PM" className={inputClass} />
          </Field>
          <Field label="Meeting Location (optional)">
            <input value={form.meetingLocation} onChange={set('meetingLocation')} placeholder="e.g. Church Hall" className={inputClass} />
          </Field>
          <Field label="Gallery Category to Show Here (optional)">
            <input value={form.galleryCategory} onChange={set('galleryCategory')} placeholder="Must match a category name in Gallery" className={inputClass} />
          </Field>
          <Field label="Display Order (lower shows first, e.g. 0 or -1 to pin at the top)">
            <input type="number" value={form.order} onChange={set('order')} className={inputClass} />
          </Field>
          <Field label="Contact Number (shown publicly on the ministry's page)">
            <input value={form.contactPhone} onChange={set('contactPhone')} className={inputClass} />
          </Field>
          <Field label="Contact Email (optional)">
            <input type="email" value={form.contactEmail} onChange={set('contactEmail')} className={inputClass} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="What We Do (shown when a visitor first clicks into this ministry — optional, falls back to the short description)">
              <textarea rows={4} value={form.details} onChange={set('details')} className={inputClass} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label='Yearly Activities (shown on the deeper "Learn More" page)'>
              <textarea rows={4} value={form.yearlyActivities} onChange={set('yearlyActivities')} className={inputClass} placeholder="e.g. Annual retreat in March, Vacation Bible School in August, Christmas carol night in December..." />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="How to Join (requirements, next steps, who to talk to)">
              <textarea rows={3} value={form.howToJoin} onChange={set('howToJoin')} className={inputClass} />
            </Field>
          </div>

          <div className="sm:col-span-2 flex items-center gap-3">
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Ministry'}
            </PrimaryButton>
            {editingId && (
              <GhostButton
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setForm(EMPTY)
                }}
              >
                Cancel
              </GhostButton>
            )}
          </div>
          {error && <p className="text-sm text-red-500 sm:col-span-2">{error}</p>}
        </form>
      </Card>

      {!ministries ? (
        <Loading />
      ) : ministries.length === 0 ? (
        <EmptyState text="No ministries added yet." />
      ) : (
        <div className="space-y-3">
          {ministries.map((m) => (
            <Card key={m._id} className="flex items-center justify-between gap-4">
              <div>
                <p className="font-display font-bold text-brown-700 dark:text-cream">{m.name}</p>
                <p className="text-xs text-brown-500 dark:text-cream/50">{m.description}</p>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <GhostButton onClick={() => handleEdit(m)}>
                  <span className="flex items-center gap-1.5"><Pencil className="h-3.5 w-3.5" /> Edit</span>
                </GhostButton>
                <DangerButton onClick={() => handleDelete(m._id)}>
                  <span className="flex items-center gap-1.5"><Trash2 className="h-3.5 w-3.5" /> Delete</span>
                </DangerButton>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
