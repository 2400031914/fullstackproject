import { createContext, useContext, useCallback, useState, useEffect } from 'react'
import { getStorage, setStorage, removeStorage, STORAGE_KEYS } from '../utils/storage.js'

export const ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
  CONTENT: 'content',
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = getStorage(STORAGE_KEYS.AUTH)
    if (stored?.id && stored?.email && stored?.role) {
      setUser(stored)
    }
  }, [])

  const login = useCallback((email, role, lmsUserId) => {
    const stored = getStorage(STORAGE_KEYS.AUTH)
    const existing = stored?.id ? stored : { id: `user_${Date.now()}`, email: '', role: ROLES.STUDENT }
    const next = {
      ...existing,
      id: lmsUserId || existing.id,
      email: email?.trim() || existing.email,
      role: role || existing.role,
    }
    setStorage(STORAGE_KEYS.AUTH, next)
    setUser(next)
    return next
  }, [])

  const logout = useCallback(() => {
    removeStorage(STORAGE_KEYS.AUTH)
    setUser(null)
  }, [])

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole: (role) => user?.role === role,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
