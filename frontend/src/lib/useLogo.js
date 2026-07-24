import { useEffect, useState } from 'react'
import { api } from './api'
import { useApiObject } from './useApiData'

// If nothing is uploaded via Admin Settings, we try a static file in /public
// under each of these names in turn — so it doesn't matter whether the
// person saved their logo as .png, .jpg, .jpeg, .svg, or .webp.
const STATIC_CANDIDATES = ['/logo.png', '/logo.jpg', '/logo.jpeg', '/logo.svg', '/logo.webp']

export function useLogo() {
  const { data } = useApiObject(api.getSettings, { logoUrl: '' })
  const [candidateIndex, setCandidateIndex] = useState(0)
  const [adminLogoFailed, setAdminLogoFailed] = useState(false)

  // Reset the fallback chain whenever the admin-uploaded logo changes
  useEffect(() => {
    setCandidateIndex(0)
    setAdminLogoFailed(false)
  }, [data.logoUrl])

  if (data.logoUrl && !adminLogoFailed) {
    return { src: data.logoUrl, onError: () => setAdminLogoFailed(true), exhausted: false }
  }

  if (candidateIndex < STATIC_CANDIDATES.length) {
    return {
      src: STATIC_CANDIDATES[candidateIndex],
      onError: () => setCandidateIndex((i) => i + 1),
      exhausted: false,
    }
  }

  return { src: null, onError: () => {}, exhausted: true }
}
