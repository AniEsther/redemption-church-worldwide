import { useEffect, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { api } from '../../lib/api'
import { formatDate } from '../../lib/useApiData'
import { AdminHeader, Card, EmptyState, Loading, Field, inputClass, PrimaryButton, GhostButton, DangerButton } from './ui/primitives'

const EMPTY = { title: '', date: '', dateLabel: '', time: '', location: '', description: '' }

export default function AdminEvents() {
  const [events, setEvents] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => api.getEvents().then(setEvents).catch((err) => setError(err.message))

  useEffect(() => {
    load()
  }, [])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (editingId) {
        await api.updateEvent(editingId, form)
      } else {
        await api.createEvent(form)
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

  const handleEdit = (ev) => {
    setEditingId(ev._id)
    setForm({
      title: ev.title,
      date: ev.date ? ev.date.slice(0, 10) : '',
      dateLabel: ev.dateLabel || '',
      time: ev.time || '',
      location: ev.location || '',
      description: ev.description || '',
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return
    await api.deleteEvent(id)
    load()
  }

  return (
    <>
      <AdminHeader title="Events" subtitle="Manage upcoming church events" />

      <Card className="mb-8">
        <h2 className="mb-4 font-display font-bold text-brown-700 dark:text-cream">
          {editingId ? 'Edit Event' : 'Add an Event'}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <input required value={form.title} onChange={set('title')} className={inputClass} />
          </Field>
          <Field label="Date">
            <input required type="date" value={form.date} onChange={set('date')} className={inputClass} />
          </Field>
          <Field label="Date Label (optional — for ranges like 'Sept 14–20')">
            <input value={form.dateLabel} onChange={set('dateLabel')} className={inputClass} placeholder="Leave blank to show the date above" />
          </Field>
          <Field label="Time">
            <input value={form.time} onChange={set('time')} className={inputClass} placeholder="e.g. 6:00 PM" />
          </Field>
          <Field label="Location">
            <input value={form.location} onChange={set('location')} className={inputClass} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description">
              <textarea rows={3} value={form.description} onChange={set('description')} className={inputClass} />
            </Field>
          </div>

          <div className="sm:col-span-2 flex items-center gap-3">
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Event'}
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

      {!events ? (
        <Loading />
      ) : events.length === 0 ? (
        <EmptyState text="No events added yet." />
      ) : (
        <div className="space-y-3">
          {events.map((ev) => (
            <Card key={ev._id} className="flex items-center justify-between gap-4">
              <div>
                <p className="font-display font-bold text-brown-700 dark:text-cream">{ev.title}</p>
                <p className="text-xs text-brown-500 dark:text-cream/50">
                  {formatDate(ev.date)}{ev.time ? ` · ${ev.time}` : ''}{ev.location ? ` · ${ev.location}` : ''}
                </p>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <GhostButton onClick={() => handleEdit(ev)}>
                  <span className="flex items-center gap-1.5"><Pencil className="h-3.5 w-3.5" /> Edit</span>
                </GhostButton>
                <DangerButton onClick={() => handleDelete(ev._id)}>
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
