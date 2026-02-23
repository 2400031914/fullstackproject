import { createContext, useContext, useCallback, useState, useEffect } from 'react'
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage.js'
import { generateId } from '../utils/id.js'

const LMSContext = createContext(null)

const DEFAULT_STATE = {
  users: [],
  courses: [],
  enrollments: [],
  materials: [],
  assignments: [],
  submissions: [],
  notifications: [],
  activityLogs: [],
  quizResults: [],
  feedbacks: [],
}

function loadState() {
  const stored = getStorage(STORAGE_KEYS.LMS_DATA)
  if (!stored) return DEFAULT_STATE
  return {
    ...DEFAULT_STATE,
    ...stored,
    users: Array.isArray(stored.users) ? stored.users : DEFAULT_STATE.users,
    courses: Array.isArray(stored.courses) ? stored.courses : DEFAULT_STATE.courses,
    enrollments: Array.isArray(stored.enrollments) ? stored.enrollments : DEFAULT_STATE.enrollments,
    materials: Array.isArray(stored.materials) ? stored.materials : DEFAULT_STATE.materials,
    assignments: Array.isArray(stored.assignments) ? stored.assignments : DEFAULT_STATE.assignments,
    submissions: Array.isArray(stored.submissions) ? stored.submissions : DEFAULT_STATE.submissions,
    notifications: Array.isArray(stored.notifications) ? stored.notifications : DEFAULT_STATE.notifications,
    activityLogs: Array.isArray(stored.activityLogs) ? stored.activityLogs : DEFAULT_STATE.activityLogs,
    quizResults: Array.isArray(stored.quizResults) ? stored.quizResults : DEFAULT_STATE.quizResults,
    feedbacks: Array.isArray(stored.feedbacks) ? stored.feedbacks : DEFAULT_STATE.feedbacks,
  }
}

function persistState(state) {
  setStorage(STORAGE_KEYS.LMS_DATA, state)
}

export function LMSProvider({ children }) {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    persistState(state)
  }, [state])

  const update = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      return next
    })
  }, [])

  const addUser = useCallback((user) => {
    const id = generateId()
    const u = { id, ...user, disabled: false }
    update((s) => ({ ...s, users: [...s.users, u] }))
    return u
  }, [update])

  const ensureUser = useCallback((email, role) => {
    let result = null
    update((s) => {
      const existing = s.users.find((u) => u.email?.toLowerCase() === email?.toLowerCase())
      if (existing) {
        result = existing
        return s
      }
      const id = generateId()
      const u = { id, email: email?.trim(), role, name: email?.split('@')[0], disabled: false }
      result = u
      return { ...s, users: [...s.users, u] }
    })
    return result
  }, [update])

  const updateUser = useCallback((id, patch) => {
    update((s) => ({
      ...s,
      users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
    }))
  }, [update])

  const addCourse = useCallback((course) => {
    const id = generateId()
    const c = { id, status: 'draft', enabled: true, ...course, createdAt: Date.now() }
    update((s) => ({ ...s, courses: [...s.courses, c] }))
    return c
  }, [update])

  const updateCourse = useCallback((id, patch) => {
    update((s) => ({
      ...s,
      courses: s.courses.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }))
  }, [update])

  const deleteCourse = useCallback((id) => {
    update((s) => ({
      ...s,
      courses: s.courses.filter((c) => c.id !== id),
      materials: s.materials.filter((m) => m.courseId !== id),
      assignments: s.assignments.filter((a) => a.courseId !== id),
      enrollments: s.enrollments.filter((e) => e.courseId !== id),
      submissions: s.submissions.filter((sub) => {
        const a = s.assignments.find((x) => x.id === sub.assignmentId)
        return !a || a.courseId !== id
      }),
    }))
  }, [update])

  const addEnrollment = useCallback((enrollment) => {
    const id = generateId()
    const e = { id, ...enrollment, enrolledAt: Date.now() }
    update((s) => ({ ...s, enrollments: [...s.enrollments, e] }))
    return e
  }, [update])

  const addMaterial = useCallback((material) => {
    const id = generateId()
    const m = { id, ...material, createdAt: Date.now() }
    update((s) => ({ ...s, materials: [...s.materials, m] }))
    return m
  }, [update])

  const updateMaterial = useCallback((id, patch) => {
    update((s) => ({
      ...s,
      materials: s.materials.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }))
  }, [update])

  const deleteMaterial = useCallback((id) => {
    update((s) => ({
      ...s,
      materials: s.materials.filter((m) => m.id !== id),
    }))
  }, [update])

  const addAssignment = useCallback((assignment) => {
    const id = generateId()
    const a = { id, ...assignment, createdAt: Date.now() }
    update((s) => ({ ...s, assignments: [...s.assignments, a] }))
    return a
  }, [update])

  const updateAssignment = useCallback((id, patch) => {
    update((s) => ({
      ...s,
      assignments: s.assignments.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }))
  }, [update])

  const addSubmission = useCallback((submission) => {
    const id = generateId()
    const sub = { id, ...submission, submittedAt: Date.now() }
    update((s) => ({ ...s, submissions: [...s.submissions, sub] }))
    return sub
  }, [update])

  const updateSubmission = useCallback((id, patch) => {
    update((prev) => ({
      ...prev,
      submissions: prev.submissions.map((sub) => (sub.id === id ? { ...sub, ...patch } : sub)),
    }))
  }, [update])

  const addNotification = useCallback((notification) => {
    const id = generateId()
    const n = { id, ...notification, read: false, createdAt: Date.now() }
    update((s) => ({ ...s, notifications: [...s.notifications, n] }))
    return n
  }, [update])

  const markNotificationRead = useCallback((id) => {
    update((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }))
  }, [update])

  const markAllNotificationsRead = useCallback((userId) => {
    update((s) => ({
      ...s,
      notifications: s.notifications.map((n) =>
        n.userId === userId ? { ...n, read: true } : n
      ),
    }))
  }, [update])

  const addActivity = useCallback((type, message, extra = {}) => {
    const id = generateId()
    const log = {
      id,
      type,
      message,
      userId: extra.userId || null,
      role: extra.role || null,
      courseId: extra.courseId || null,
      timestamp: Date.now(),
    }
    update((s) => ({ ...s, activityLogs: [log, ...s.activityLogs] }))
    return log
  }, [update])

  const addQuizResult = useCallback((result) => {
    const id = generateId()
    const r = { id, ...result, timestamp: Date.now() }
    update((s) => ({ ...s, quizResults: [...s.quizResults, r] }))
    return r
  }, [update])

  const addFeedback = useCallback((feedback) => {
    const id = generateId()
    const f = { id, ...feedback, timestamp: Date.now() }
    update((s) => ({ ...s, feedbacks: [...s.feedbacks, f] }))
    return f
  }, [update])

  const updateFeedback = useCallback((id, patch) => {
    update((s) => ({
      ...s,
      feedbacks: s.feedbacks.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    }))
  }, [update])

  const value = {
    ...state,
    update,
    addUser,
    ensureUser,
    updateUser,
    addCourse,
    updateCourse,
    deleteCourse,
    addEnrollment,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    addAssignment,
    updateAssignment,
    addSubmission,
    updateSubmission,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    addActivity,
    addQuizResult,
    addFeedback,
    updateFeedback,
  }

  return <LMSContext.Provider value={value}>{children}</LMSContext.Provider>
}

export function useLMS() {
  const ctx = useContext(LMSContext)
  if (!ctx) throw new Error('useLMS must be used within LMSProvider')
  return ctx
}
