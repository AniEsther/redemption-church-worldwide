import { useEffect, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { api } from '../../lib/api'
import { formatDate } from '../../lib/useApiData'
import { AdminHeader, Card, EmptyState, Loading, Field, inputClass, PrimaryButton, GhostButton, DangerButton } from './ui/primitives'
import UploadField from './ui/UploadField'

const EMPTY = { title: '', speaker: '', date: '', topic: '', thumbnailUrl: '', videoUrl: '', audioUrl: '', downloadUrl: '' }

export default function AdminSermons() {
  const [sermons, setSermons] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => api.getSermons().then(setSermons).catch((err) => setError(err.message))

  useEffect(() => {
    load()
  }, [])

  const set = (key) => (v) => setForm((f) => ({ ...f, [key]: typeof v === 'string' ? v : v.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.videoUrl.trim() && !form.audioUrl.trim() && !form.downloadUrl.trim()) {
      setError('Add at least one of Video, Audio, or Download before saving — a sermon needs somewhere for people to actually watch/listen/read it.')
      return
    }

    setSaving(true)
    try {
      if (editingId) {
        await api.updateSermon(editingId, form)
      } else {
        await api.createSermon(form)
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

  const handleEdit = (s) => {
    setEditingId(s._id)
    setForm({
      title: s.title,
      speaker: s.speaker,
      date: s.date ? s.date.slice(0, 10) : '',
      topic: s.topic || '',
      thumbnailUrl: s.thumbnailUrl || '',
      videoUrl: s.videoUrl || '',
      audioUrl: s.audioUrl || '',
      downloadUrl: s.downloadUrl || '',
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this sermon?')) return
    await api.deleteSermon(id)
    load()
  }

  return (
    <>
      <AdminHeader title="Sermons" subtitle="Upload and manage sermon messages" />

      <Card className="mb-8">
        <h2 className="mb-1 font-display font-bold text-brown-700 dark:text-cream">
          {editingId ? 'Edit Sermon' : 'Add a Sermon'}
        </h2>
        <p className="mb-4 text-xs text-brown-500 dark:text-cream/50">
          For Video/Audio/Download, you can either upload a file directly, or paste a link from
          anywhere — YouTube, Spotify, Telegram, SoundCloud, Google Drive, etc.
        </p>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <input required value={form.title} onChange={set('title')} className={inputClass} />
          </Field>
          <Field label="Speaker">
            <input required value={form.speaker} onChange={set('speaker')} className={inputClass} />
          </Field>
          <Field label="Date">
            <input required type="date" value={form.date} onChange={set('date')} className={inputClass} />
          </Field>
          <Field label="Topic (for filtering, e.g. Faith, Marriage, Prayer)">
            <input value={form.topic} onChange={set('topic')} className={inputClass} />
          </Field>
          <UploadField label="Thumbnail" value={form.thumbnailUrl} onChange={set('thumbnailUrl')} accept="image/*" />
          <Field label="Video Link (YouTube, Facebook Live, etc.)">
            <input value={form.videoUrl} onChange={set('videoUrl')} className={inputClass} placeholder="https://youtube.com/watch?v=..." />
          </Field>
          <UploadField label="Audio (upload a file, or paste a Spotify / Telegram / SoundCloud link)" value={form.audioUrl} onChange={set('audioUrl')} accept="audio/*" />
          <UploadField label="Download (PDF notes, or paste any link)" value={form.downloadUrl} onChange={set('downloadUrl')} accept=".pdf" />

          <div className="sm:col-span-2 flex items-center gap-3">
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Sermon'}
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

      {!sermons ? (
        <Loading />
      ) : sermons.length === 0 ? (
        <EmptyState text="No sermons added yet." />
      ) : (
        <div className="space-y-3">
          {sermons.map((s) => (
            <Card key={s._id} className="flex items-center justify-between gap-4">
              <div>
                <p className="font-display font-bold text-brown-700 dark:text-cream">{s.title}</p>
                <p className="text-xs text-brown-500 dark:text-cream/50">
                  {s.speaker} · {formatDate(s.date)}{s.topic ? ` · ${s.topic}` : ''}
                </p>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <GhostButton onClick={() => handleEdit(s)}>
                  <span className="flex items-center gap-1.5"><Pencil className="h-3.5 w-3.5" /> Edit</span>
                </GhostButton>
                <DangerButton onClick={() => handleDelete(s._id)}>
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
