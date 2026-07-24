import { createContext, useContext, useEffect, useState } from 'react'
import { api, getToken, setToken, clearToken, setUnauthorizedHandler } from '../lib/api'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [authed, setAuthed] = useState(Boolean(getToken()))
  const [admin, setAdmin] = useState(null)
  const [sessionExpired, setSessionExpired] = useState(false)

  // Any 401 from anywhere in the app flips this immediately, so a stale
  // token can't leave the admin stuck seeing silent errors on every page.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setAuthed(false)
      setAdmin(null)
      setSessionExpired(true)
    })
    return () => setUnauthorizedHandler(null)
  }, [])

  const login = async (email, password) => {
    const res = await api.login(email, password)
    setToken(res.token)
    setAdmin(res.admin)
    setAuthed(true)
    setSessionExpired(false)
  }

  const logout = () => {
    clearToken()
    setAuthed(false)
    setAdmin(null)
    setSessionExpired(false)
  }

  return (
    <AdminAuthContext.Provider value={{ authed, admin, sessionExpired, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
