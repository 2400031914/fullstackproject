import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useLMS } from '../contexts/LMSContext.jsx'

const roleConfig = {
  student: {
    label: 'Student',
    links: [
      { to: '/student/dashboard', label: 'Dashboard' },
      { to: '/student/courses', label: 'My Courses' },
      { to: '/student/assignments', label: 'Assignments' },
      { to: '/student/progress', label: 'Progress' },
    ],
  },
  instructor: {
    label: 'Instructor',
    links: [{ to: '/instructor/dashboard', label: 'Dashboard' }],
  },
  admin: {
    label: 'Admin',
    links: [{ to: '/admin/dashboard', label: 'Dashboard' }],
  },
  content: {
    label: 'Content Creator',
    links: [{ to: '/content/dashboard', label: 'Dashboard' }],
  },
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function DashboardLayout({ role }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { notifications, markNotificationRead, markAllNotificationsRead } = useLMS()
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef(null)

  const config = roleConfig[role]
  const userNotifications = notifications.filter((n) => n.userId === user?.id && !n.read)

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!config) return null

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-64 flex flex-col border-r border-slate-200 bg-white">
          <div className="px-6 py-5 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white font-semibold">
                LMS
              </div>
              <div>
                <div className="text-sm font-semibold tracking-wide">NovaLearn</div>
                <div className="text-xs text-slate-400">{config.label} Portal</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {config.links.map((item) => {
              const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/')
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={classNames(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-slate-200 px-4 py-4 text-xs text-slate-500">
            <div className="flex items-center justify-between">
              <span>{user?.email || config.label}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="font-medium text-slate-600 hover:text-slate-900"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">{config.label} Workspace</div>
              <div className="text-sm font-semibold text-slate-900">Welcome back</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => {
                    setNotifOpen((v) => !v)
                    if (notifOpen && userNotifications.length > 0) {
                      markAllNotificationsRead(user?.id)
                    }
                  }}
                  className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Notifications"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {userNotifications.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-medium text-white">
                      {userNotifications.length > 9 ? '9+' : userNotifications.length}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
                    {userNotifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-slate-500">No new notifications</div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto">
                        {userNotifications.slice(0, 10).map((n) => (
                          <button
                            key={n.id}
                            type="button"
                            onClick={() => {
                              markNotificationRead(n.id)
                              setNotifOpen(false)
                            }}
                            className="flex w-full flex-col gap-0.5 px-4 py-2 text-left hover:bg-slate-50"
                          >
                            <span className="text-xs font-medium text-slate-900">{n.title || 'Notification'}</span>
                            <span className="text-[11px] text-slate-500">{n.message}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 text-xs font-semibold text-white">
                {(user?.email?.[0] || 'U').toUpperCase()}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto px-6 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
