import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { CHURCH } from '../../data/content'

export default function AdminLogin() {
  const { authed, login } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  if (authed) {
    const dest = location.state?.from || '/admin'
    return <Navigate to={dest} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brown-800 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-orange-400/20 bg-brown-900 p-8 text-cream">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-orange-300 font-display text-lg font-bold text-orange-200">
            RC
          </div>
          <h1 className="mt-4 font-display text-xl font-bold">{CHURCH.name}</h1>
          <p className="eyebrow mt-1 text-[11px] text-orange-300">Admin Dashboard</p>
        </div>

        {location.state?.sessionExpired && (
          <p className="mt-6 rounded-lg bg-orange-400/10 px-4 py-3 text-center text-sm text-orange-300">
            Your session expired — please sign in again.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            required
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-cream/15 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream/40 focus:border-orange-400"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-cream/15 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream/40 focus:border-orange-400"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-400 px-6 py-3 eyebrow text-xs text-white transition-transform hover:scale-105 disabled:opacity-60"
          >
            <Lock className="h-4 w-4" />
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
