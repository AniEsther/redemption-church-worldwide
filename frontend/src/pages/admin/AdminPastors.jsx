import { useEffect, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { api } from '../../lib/api'
import { AdminHeader, Card, EmptyState, Loading, Field, inputClass, PrimaryButton, GhostButton, DangerButton } from './ui/primitives'
import UploadField from './ui/UploadField'

const EMPTY = { name: '', role: '', bio: '', portraitUrl: '' }

export default function AdminPastors() {
  const [leaders, setLeaders] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => api.getLeaders().then(setLeaders).catch((err) => setError(err.message))

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
        await api.updateLeader(editingId, form)
      } else {
        await api.createLeader(form)
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

  const handleEdit = (l) => {
    setEditingId(l._id)
    setForm({ name: l.name, role: l.role, bio: l.bio || '', portraitUrl: l.portraitUrl || '' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this pastor/leader?')) return
    await api.deleteLeader(id)
    load()
  }

  return (
    <>
      <AdminHeader title="Pastors" subtitle="Manage the leaders shown on the About and Pastors pages" />

      <Card className="mb-8">
        <h2 className="mb-4 font-display font-bold text-brown-700 dark:text-cream">
          {editingId ? 'Edit Leader' : 'Add a Leader'}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input required value={form.name} onChange={set('name')} className={inputClass} />
          </Field>
          <Field label="Role">
            <input required placeholder="e.g. Founder & Senior Pastor" value={form.role} onChange={set('role')} className={inputClass} />
          </Field>
          <div className="sm:col-span-2">
            <UploadField label="Portrait (optional)" value={form.portraitUrl} onChange={set('portraitUrl')} accept="image/*" />
          </div>
          <div className="sm:col-span-2">
            <Field label="Biography">
              <textarea rows={4} value={form.bio} onChange={set('bio')} className={inputClass} />
            </Field>
          </div>

          <div className="sm:col-span-2 flex items-center gap-3">
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Leader'}
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

      {!leaders ? (
        <Loading />
      ) : leaders.length === 0 ? (
        <EmptyState text="No pastors added yet." />
      ) : (
        <div className="space-y-3">
          {leaders.map((l) => (
            <Card key={l._id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {l.portraitUrl && (
                  <img src={l.portraitUrl} alt={l.name} className="h-12 w-12 flex-shrink-0 rounded-full object-cover" />
                )}
                <div>
                  <p className="font-display font-bold text-brown-700 dark:text-cream">{l.name}</p>
                  <p className="text-xs text-orange-500">{l.role}</p>
                </div>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <GhostButton onClick={() => handleEdit(l)}>
                  <span className="flex items-center gap-1.5"><Pencil className="h-3.5 w-3.5" /> Edit</span>
                </GhostButton>
                <DangerButton onClick={() => handleDelete(l._id)}>
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
