import { useAuth } from '../../contexts/AuthContext.jsx'
import { useLMS } from '../../contexts/LMSContext.jsx'
import { ProgressBar } from '../../components/ProgressBar.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import { Link } from 'react-router-dom'

export default function StudentProgress() {
  const { user } = useAuth()
  const { courses, materials, assignments, submissions, enrollments } = useLMS()

  const myEnrollments = enrollments.filter((e) => e.userId === user?.id)
  const myCourseIds = myEnrollments.map((e) => e.courseId)
  const myCourses = courses.filter((c) => c.status === 'published' && myCourseIds.includes(c.id))

  const getCourseProgress = (courseId) => {
    const courseMats = materials.filter((m) => m.courseId === courseId)
    if (courseMats.length === 0) return 0
    const courseAssignments = assignments.filter((a) => a.courseId === courseId)
    const mySubs = submissions.filter((s) => s.userId === user?.id && s.status === 'graded')
    const gradedCount = courseAssignments.filter((a) => mySubs.some((s) => s.assignmentId === a.id)).length
    const matWeight = 60
    const assignWeight = 40
    const matProgress = Math.min(100, (courseMats.length / Math.max(1, courseMats.length)) * 100)
    const assignProgress = courseAssignments.length === 0 ? 100 : (gradedCount / courseAssignments.length) * 100
    return Math.round((matProgress * matWeight / 100) + (assignProgress * assignWeight / 100))
  }

  const getGrade = (courseId) => {
    const courseAssignments = assignments.filter((a) => a.courseId === courseId)
    const mySubs = submissions.filter((s) => s.userId === user?.id && s.status === 'graded')
    let total = 0
    let maxTotal = 0
    courseAssignments.forEach((a) => {
      const sub = mySubs.find((s) => s.assignmentId === a.id)
      if (sub) {
        total += sub.marks ?? 0
        maxTotal += a.maxMarks ?? 100
      }
    })
    if (maxTotal === 0) return '-'
    return `${Math.round((total / maxTotal) * 100)}%`
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Progress</h2>
        <p className="text-xs text-slate-500">Track your completion and grades per course</p>
      </div>

      {myCourses.length === 0 ? (
        <EmptyState
          title="No enrolled courses"
          description="Enroll in courses to track your progress."
          action={<Link to="/student/courses" className="text-sm font-medium text-indigo-600">Browse courses</Link>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myCourses.map((c) => {
            const progress = getCourseProgress(c.id)
            const grade = getGrade(c.id)
            return (
              <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-slate-900">{c.title}</h3>
                  <Link to={`/student/courses/${c.id}`} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                    View
                  </Link>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Completion</span>
                    <span>{progress}%</span>
                  </div>
                  <ProgressBar value={progress} showLabel={false} />
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Overall grade</span>
                    <span className="font-medium text-slate-900">{grade}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
