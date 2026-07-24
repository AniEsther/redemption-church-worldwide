import { useEffect } from 'react'
import { api } from '../lib/api'
import { useApiObject } from '../lib/useApiData'

const FALLBACK = { fontHeading: 'Playfair Display', fontBody: 'Inter' }

export default function FontLoader() {
  const { data } = useApiObject(api.getSettings, FALLBACK)

  useEffect(() => {
    document.documentElement.style.setProperty('--font-heading', `"${data.fontHeading}"`)
    document.documentElement.style.setProperty('--font-body', `"${data.fontBody}"`)
  }, [data.fontHeading, data.fontBody])

  return null
}
