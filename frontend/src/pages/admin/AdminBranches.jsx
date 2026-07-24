import { useEffect, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { api } from '../../lib/api'
import { AdminHeader, Card, EmptyState, Loading, Field, inputClass, PrimaryButton, GhostButton, DangerButton } from './ui/primitives'
import UploadField from './ui/UploadField'

const EMPTY = { name: '', location: '', pastorName: '', phone: '', email: '', imageUrl: '', mapEmbedUrl: '' }

export default function AdminBranches() {
  const [branches, setBranches] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => api.getBranches().then(setBranches).catch((err) => setError(err.message))

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
        await api.updateBranch(editingId, form)
      } else {
        await api.createBranch(form)
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

  const handleEdit = (b) => {
    setEditingId(b._id)
    setForm({
      name: b.name,
      location: b.location,
      pastorName: b.pastorName || '',
      phone: b.phone || '',
      email: b.email || '',
      imageUrl: b.imageUrl || '',
      mapEmbedUrl: b.mapEmbedUrl || '',
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this branch?')) return
    await api.deleteBranch(id)
    load()
  }

  return (
    <>
      <AdminHeader title="Branches" subtitle="Manage every location shown on the Branches page" />

      <Card className="mb-8">
        <h2 className="mb-4 font-display font-bold text-brown-700 dark:text-cream">
          {editingId ? 'Edit Branch' : 'Add a Branch'}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Branch Name">
              <input required placeholder="e.g. The Redemption Church Worldwide - Lagos" value={form.name} onChange={set('name')} className={inputClass} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Location / Address">
              <input required value={form.location} onChange={set('location')} className={inputClass} />
            </Field>
          </div>
          <Field label="Pastor in Charge">
            <input value={form.pastorName} onChange={set('pastorName')} className={inputClass} />
          </Field>
          <Field label="Phone">
            <input value={form.phone} onChange={set('phone')} className={inputClass} />
          </Field>
          <Field label="Email">
            <input type="email" value={form.email} onChange={set('email')} className={inputClass} />
          </Field>
          <div className="sm:col-span-2">
            <UploadField label="Photo (optional)" value={form.imageUrl} onChange={set('imageUrl')} accept="image/*" />
          </div>
          <div className="sm:col-span-2">
            <Field label="Google Maps Embed URL (optional)">
              <input value={form.mapEmbedUrl} onChange={set('mapEmbedUrl')} className={inputClass} />
            </Field>
          </div>

          <div className="sm:col-span-2 flex items-center gap-3">
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Branch'}
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

      {!branches ? (
        <Loading />
      ) : branches.length === 0 ? (
        <EmptyState text="No branches added yet." />
      ) : (
        <div className="space-y-3">
          {branches.map((b) => (
            <Card key={b._id} className="flex items-center justify-between gap-4">
              <div>
                <p className="font-display font-bold text-brown-700 dark:text-cream">{b.name}</p>
                <p className="text-xs text-brown-500 dark:text-cream/50">{b.location}</p>
                {b.pastorName && <p className="mt-1 text-xs text-orange-500">{b.pastorName}</p>}
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <GhostButton onClick={() => handleEdit(b)}>
                  <span className="flex items-center gap-1.5"><Pencil className="h-3.5 w-3.5" /> Edit</span>
                </GhostButton>
                <DangerButton onClick={() => handleDelete(b._id)}>
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
