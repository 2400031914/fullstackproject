import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { ROLES } from '../contexts/AuthContext.jsx'

const ROLE_PATHS = {
  [ROLES.STUDENT]: ['/student'],
  [ROLES.INSTRUCTOR]: ['/instructor'],
  [ROLES.ADMIN]: ['/admin'],
  [ROLES.CONTENT]: ['/content'],
}

function pathBelongsToRole(pathname, role) {
  const prefix = ROLE_PATHS[role]
  if (!prefix) return false
  return prefix.some((p) => pathname.startsWith(p))
}

export function RouteGuard({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()
  const pathname = location.pathname

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: pathname }} replace />
  }

  const userRole = user.role
  const isAllowed = allowedRoles?.includes(userRole)
  const pathMatchesRole = pathBelongsToRole(pathname, userRole)

  if (!isAllowed || !pathMatchesRole) {
    const fallback = {
      [ROLES.STUDENT]: '/student/dashboard',
      [ROLES.INSTRUCTOR]: '/instructor/dashboard',
      [ROLES.ADMIN]: '/admin/dashboard',
      [ROLES.CONTENT]: '/content/dashboard',
    }[userRole] || '/login'
    return <Navigate to={fallback} replace />
  }

  return children
}
