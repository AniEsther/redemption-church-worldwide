import { useEffect, useMemo, useState } from 'react'
import { Trash2, UploadCloud } from 'lucide-react'
import { api } from '../../lib/api'
import { AdminHeader, Card, EmptyState, Loading, Field, inputClass, PrimaryButton } from './ui/primitives'

export default function AdminGallery() {
  const [images, setImages] = useState(null)
  const [files, setFiles] = useState([])
  const [category, setCategory] = useState('')
  const [caption, setCaption] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [progress, setProgress] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const load = () => api.getGallery().then(setImages).catch((err) => setError(err.message))

  useEffect(() => {
    load()
  }, [])

  const existingCategories = useMemo(() => {
    if (!images) return []
    return Array.from(new Set(images.map((img) => img.category).filter(Boolean)))
  }, [images])

  const filteredImages = useMemo(() => {
    if (!images) return []
    if (activeFilter === 'All') return images
    return images.filter((img) => (img.category || 'Uncategorized') === activeFilter)
  }, [images, activeFilter])

  const filterOptions = useMemo(() => {
    if (!images) return ['All']
    const hasUncategorized = images.some((img) => !img.category)
    return ['All', ...existingCategories, ...(hasUncategorized ? ['Uncategorized'] : [])]
  }, [images, existingCategories])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (files.length === 0) {
      setError('Choose one or more photos to upload.')
      return
    }
    if (!category.trim()) {
      setError('Give this album/category a name — e.g. "Sunday Service (19th July 2026)".')
      return
    }
    setError('')
    setSaving(true)
    try {
      setProgress(`Uploading ${files.length} photo${files.length > 1 ? 's' : ''}…`)
      const { urls } = await api.uploadFiles(files)
      setProgress('Saving to gallery…')
      await Promise.all(urls.map((imageUrl) => api.createGalleryImage({ imageUrl, caption, category: category.trim() })))
      setFiles([])
      setCaption('')
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
      setProgress('')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this image?')) return
    await api.deleteGalleryImage(id)
    load()
  }

  const handleDeleteAlbum = async () => {
    if (activeFilter === 'All') return
    const targets = images.filter((img) => (img.category || 'Uncategorized') === activeFilter)
    if (!confirm(`Delete all ${targets.length} photo(s) in "${activeFilter}"? This can't be undone.`)) return
    await Promise.all(targets.map((img) => api.deleteGalleryImage(img._id)))
    setActiveFilter('All')
    load()
  }

  return (
    <>
      <AdminHeader title="Gallery" subtitle="Upload a set of photos as an album/category — e.g. an event or a Sunday service" />

      <Card className="mb-8">
        <h2 className="mb-1 font-display font-bold text-brown-700 dark:text-cream">Add an Album</h2>
        <p className="mb-4 text-xs text-brown-500 dark:text-cream/50">
          Pick as many photos as you like — they'll all be uploaded together under one category.
          Visitors can click that category on the Gallery page to see just these photos.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Category / Album Name">
            <input
              list="existing-categories"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder='e.g. "Sunday Service (19th July 2026)" or "Jerusalem Encounter Program (Nov 22–29, 2026)"'
              className={inputClass}
            />
            <datalist id="existing-categories">
              {existingCategories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {existingCategories.length > 0 && (
              <p className="mt-1.5 text-xs text-brown-400 dark:text-cream/40">
                Existing: {existingCategories.join(', ')} — start typing to reuse one, or enter a new name.
              </p>
            )}
          </Field>

          <Field label="Caption (optional, applied to all photos in this batch)">
            <input value={caption} onChange={(e) => setCaption(e.target.value)} className={inputClass} />
          </Field>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-brown-600 dark:text-cream/70">Photos</span>
            <div className="flex items-center gap-3 rounded-lg border border-dashed border-brown-300 px-4 py-6 text-center dark:border-brown-600">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="w-full text-sm text-brown-500 dark:text-cream/60"
              />
            </div>
            {files.length > 0 && (
              <p className="mt-1.5 text-xs text-orange-500">{files.length} photo{files.length > 1 ? 's' : ''} selected</p>
            )}
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}
          <PrimaryButton type="submit" disabled={saving}>
            <span className="flex items-center gap-1.5">
              <UploadCloud className="h-3.5 w-3.5" />
              {saving ? progress || 'Uploading…' : 'Upload Album'}
            </span>
          </PrimaryButton>
        </form>
      </Card>

      {!images ? (
        <Loading />
      ) : images.length === 0 ? (
        <EmptyState text="No photos added yet." />
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {filterOptions.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`rounded-full px-4 py-2 eyebrow text-[10px] transition-colors ${
                  activeFilter === cat
                    ? 'bg-orange-400 text-white'
                    : 'border border-brown-200 text-brown-600 hover:border-orange-400 dark:border-brown-600 dark:text-cream/70'
                }`}
              >
                {cat}
              </button>
            ))}
            {activeFilter !== 'All' && (
              <button
                onClick={handleDeleteAlbum}
                className="ml-auto flex items-center gap-1.5 rounded-full border border-red-300 px-4 py-2 eyebrow text-[10px] text-red-500 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete This Album
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filteredImages.map((img) => (
              <div key={img._id} className="group relative overflow-hidden rounded-xl">
                <img src={img.imageUrl} alt={img.caption || 'Gallery'} className="aspect-square w-full object-cover" />
                <button
                  onClick={() => handleDelete(img._id)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Delete image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                {img.caption && (
                  <p className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-ink/80 to-transparent px-2 py-1.5 text-xs text-white">
                    {img.caption}
                  </p>
                )}
                {img.category && (
                  <span className="absolute left-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 text-[10px] text-orange-300">
                    {img.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
