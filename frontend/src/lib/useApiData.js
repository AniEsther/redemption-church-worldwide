import { useEffect, useState } from 'react'

// Fetches from the backend; falls back to (and stays on) the provided static
// data if the request fails or the backend has nothing yet. This lets pages
// work immediately out of the box, then "go live" once the admin adds data.
export function useApiData(fetcher, fallback) {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetcher()
      .then((res) => {
        if (active && Array.isArray(res) && res.length > 0) setData(res)
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { data, loading }
}

// For single-record data (e.g. site settings). Merges the fetched object
// over the fallback so empty/unset fields on the backend keep showing the
// default copy until an admin fills them in.
export function useApiObject(fetcher, fallback) {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetcher()
      .then((res) => {
        if (active && res && typeof res === 'object') {
          const merged = { ...fallback }
          for (const key of Object.keys(fallback)) {
            const value = res[key]
            const hasValue = Array.isArray(value) ? value.length > 0 : Boolean(value)
            if (hasValue) merged[key] = value
          }
          setData(merged)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { data, loading }
}

// Dates are stored as UTC midnight (that's what a plain <input type="date">
// submits). We must format them in UTC too — otherwise a visitor in a
// timezone behind UTC (e.g. the Americas) sees the day *before* the one
// the admin actually picked.
export function formatDate(value) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

export function formatDay(value) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'UTC' })
}

export function formatMonth(value) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
}
