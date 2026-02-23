import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLMS } from '../../contexts/LMSContext.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '', confirm: '' })
  const { users, addUser } = useLMS()
  const toast = useToast()
  const navigate = useNavigate()

  const validate = () => {
    const next = { email: '', password: '', confirm: '' }
    const trimmed = email.trim()
    if (!trimmed) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) next.email = 'Enter a valid email'
    else if (users.some((u) => u.email?.toLowerCase() === trimmed.toLowerCase())) {
      next.email = 'An account with this email already exists'
    }

    if (!password) next.password = 'Password is required'
    if (password && password.length < 8) next.password = 'Password must be at least 8 characters'
    if (confirmPassword !== password) next.confirm = 'Passwords do not match'

    setErrors(next)
    return !next.email && !next.password && !next.confirm
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    addUser({ email: email.trim(), password, role: 'student', name: email.split('@')[0] })
    toast.toast('Account created. You can now sign in.', 'success')
    navigate('/login', { replace: true })
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
              <div className="text-xs text-slate-400">Create your account</div>
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
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 ${
                  errors.password ? 'border-rose-500 focus:border-rose-400 focus:ring-rose-400' : 'border-slate-700 bg-slate-900 focus:border-indigo-400 focus:ring-indigo-400'
                }`}
              />
              {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirm" className="mb-1.5 block text-xs font-medium text-slate-300">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 ${
                  errors.confirm ? 'border-rose-500 focus:border-rose-400 focus:ring-rose-400' : 'border-slate-700 bg-slate-900 focus:border-indigo-400 focus:ring-indigo-400'
                }`}
              />
              {errors.confirm && <p className="mt-1 text-xs text-rose-400">{errors.confirm}</p>}
            </div>
            <button
              type="submit"
              disabled={!email.trim() || !password || !confirmPassword}
              className="mt-2 flex w-full items-center justify-center rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-colors hover:bg-indigo-400 disabled:opacity-50 disabled:hover:bg-indigo-500"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

