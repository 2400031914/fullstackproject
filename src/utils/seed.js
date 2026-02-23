import { getStorage, setStorage, STORAGE_KEYS } from './storage.js'

const DEFAULT_PASSWORDS_BY_EMAIL = {
  'admin@lms.edu': 'Admin123!',
  'instructor@lms.edu': 'Instructor123!',
  'content@lms.edu': 'Content123!',
  'student@lms.edu': 'Student123!',
}

export function migrateUserPasswords() {
  const stored = getStorage(STORAGE_KEYS.LMS_DATA)
  if (!stored?.users?.length) return
  let changed = false
  const users = stored.users.map((u) => {
    if (u.password != null && u.password !== '') return u
    const defaultPass = DEFAULT_PASSWORDS_BY_EMAIL[u.email?.toLowerCase()]
    if (defaultPass) {
      changed = true
      return { ...u, password: defaultPass }
    }
    return u
  })
  if (changed) {
    setStorage(STORAGE_KEYS.LMS_DATA, { ...stored, users })
  }
}

export function seedIfEmpty() {
  const stored = getStorage(STORAGE_KEYS.LMS_DATA)
  if (stored && (stored.courses?.length > 0 || stored.users?.length > 0)) {
    return
  }

  const seedUsers = [
    { id: 'seed_admin', email: 'admin@lms.edu', role: 'admin', name: 'Admin User', disabled: false, password: 'Admin123!' },
    { id: 'seed_instructor', email: 'instructor@lms.edu', role: 'instructor', name: 'Jane Instructor', disabled: false, password: 'Instructor123!' },
    { id: 'seed_content', email: 'content@lms.edu', role: 'content', name: 'Content Creator', disabled: false, password: 'Content123!' },
    { id: 'seed_student', email: 'student@lms.edu', role: 'student', name: 'John Student', disabled: false, password: 'Student123!' },
  ]

  const seedCourses = [
    { id: 'c1', title: 'Introduction to Machine Learning', description: 'Fundamentals of ML', status: 'published', enabled: true, instructorId: 'seed_instructor', createdAt: Date.now() - 86400000 * 30 },
    { id: 'c2', title: 'Product Design Basics', description: 'UX and design thinking', status: 'published', enabled: true, instructorId: 'seed_instructor', createdAt: Date.now() - 86400000 * 20 },
    { id: 'c3', title: 'Research Methods', description: 'Academic research fundamentals', status: 'draft', enabled: true, instructorId: 'seed_instructor', createdAt: Date.now() - 86400000 * 10 },
  ]

  const seedMaterials = [
    { id: 'm1', courseId: 'c1', title: 'Week 1 - Introduction', type: 'pdf', url: '/sample.pdf', order: 0 },
    { id: 'm2', courseId: 'c1', title: 'Week 2 - Linear Regression', type: 'pdf', url: '/sample.pdf', order: 1 },
    { id: 'm3', courseId: 'c1', title: 'Quiz: Module 1', type: 'quiz', order: 2 },
    { id: 'm4', courseId: 'c2', title: 'Design Thinking Overview', type: 'video', url: '#', order: 0 },
  ]

  const seedAssignments = [
    { id: 'a1', courseId: 'c1', title: 'Project Milestone 1', dueDate: Date.now() + 86400000 * 7, maxMarks: 100 },
    { id: 'a2', courseId: 'c1', title: 'Weekly Quiz 1', dueDate: Date.now() - 86400000 * 2, maxMarks: 20 },
    { id: 'a3', courseId: 'c2', title: 'Design Critique', dueDate: Date.now() + 86400000 * 14, maxMarks: 50 },
  ]

  const seedEnrollments = [
    { id: 'e1', courseId: 'c1', userId: 'seed_student', enrolledAt: Date.now() - 86400000 * 14 },
    { id: 'e2', courseId: 'c2', userId: 'seed_student', enrolledAt: Date.now() - 86400000 * 7 },
  ]

  const seedSubmissions = [
    { id: 's1', assignmentId: 'a2', userId: 'seed_student', fileName: 'quiz1.pdf', submittedAt: Date.now() - 86400000 * 3, marks: 18, feedback: 'Good work!', status: 'graded' },
  ]

  const seedActivityLogs = []
  const seedQuizResults = []
  const seedFeedbacks = []

  setStorage(STORAGE_KEYS.LMS_DATA, {
    users: seedUsers,
    courses: seedCourses,
    materials: seedMaterials,
    assignments: seedAssignments,
    enrollments: seedEnrollments,
    submissions: seedSubmissions,
    notifications: [],
    activityLogs: seedActivityLogs,
    quizResults: seedQuizResults,
    feedbacks: seedFeedbacks,
  })
}
