import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, ROLES } from '../../contexts/AuthContext.jsx'
import { useLMS } from '../../contexts/LMSContext.jsx'
import { Spinner } from '../../components/Spinner.jsx'

const DASHBOARD_BY_ROLE = {
  [ROLES.STUDENT]: '/student/dashboard',
  [ROLES.INSTRUCTOR]: '/instructor/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.CONTENT]: '/content/dashboard',
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '', form: '' })
  const [submitting, setSubmitting] = useState(false)
  const { login, user, isAuthenticated } = useAuth()
  const { users } = useLMS()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated && user) {
      const dest = DASHBOARD_BY_ROLE[user.role] || '/login'
      navigate(dest, { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  const validate = () => {
    const next = { email: '', password: '', form: '' }
    if (!email.trim()) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter a valid email'
    }
    if (!password) {
      next.password = 'Password is required'
    }
    setErrors(next)
    return !next.email && !next.password
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (submitting) return

    if (!validate()) return

    setSubmitting(true)

    const trimmed = email.trim().toLowerCase()
    const existing = users.find((u) => u.email?.toLowerCase() === trimmed)

    if (!existing) {
      setErrors((prev) => ({ ...prev, form: 'No account found with this email.' }))
      setSubmitting(false)
      return
    }

    if (existing.password !== password) {
      setErrors((prev) => ({ ...prev, form: 'Incorrect password.' }))
      setSubmitting(false)
      return
    }

    const loggedIn = login(existing.email, existing.role, existing.id)
    const dest = DASHBOARD_BY_ROLE[loggedIn.role] || '/login'
    navigate(dest, { replace: true })
    setSubmitting(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl backdrop-blur">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm font-semibold text-white">
              NL
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-50">NovaLearn</div>
              <div className="text-xs text-slate-400">Sign in to continue</div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@academy.edu"
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 ${
                  errors.email ? 'border-rose-500 focus:border-rose-400 focus:ring-rose-400' : 'border-slate-700 bg-slate-900 focus:border-indigo-400 focus:ring-indigo-400'
                }`}
              />
              {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full rounded-lg border px-3 py-2 pr-9 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 ${
                    errors.password ? 'border-rose-500 focus:border-rose-400 focus:ring-rose-400' : 'border-slate-700 bg-slate-900 focus:border-indigo-400 focus:ring-indigo-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-slate-400 hover:text-slate-200"
                  tabIndex={-1}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password}</p>}
            </div>
            {errors.form && (
              <p className="text-xs text-rose-400">
                {errors.form}
              </p>
            )}

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                className="text-slate-300 hover:text-white"
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-indigo-300 hover:text-indigo-200"
              >
                Don&apos;t have an account? Sign up
              </button>
            </div>
            <button
              type="submit"
              disabled={!email.trim() || !password || submitting}
              className="mt-2 flex w-full items-center justify-center rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-colors hover:bg-indigo-400 disabled:opacity-50 disabled:hover:bg-indigo-500"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
