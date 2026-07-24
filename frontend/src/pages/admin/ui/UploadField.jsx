import { useState } from 'react'
import { UploadCloud, Check } from 'lucide-react'
import { api } from '../../../lib/api'
import { inputClass } from './primitives'

export default function UploadField({ label, value, onChange, accept = 'image/*' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const { url } = await api.uploadFile(file)
      onChange(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-brown-600 dark:text-cream/70">{label}</span>
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Paste a URL, or upload a file"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
        <label className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-brown-200 px-3 py-2.5 text-xs text-brown-600 hover:border-orange-400 dark:border-brown-600 dark:text-cream/70">
          {uploading ? 'Uploading…' : value ? <Check className="h-3.5 w-3.5 text-orange-500" /> : <UploadCloud className="h-3.5 w-3.5" />}
          Upload
          <input type="file" accept={accept} onChange={handleFile} className="hidden" />
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </label>
  )
}
