import { useAuth } from '../../contexts/AuthContext.jsx'
import { useLMS } from '../../contexts/LMSContext.jsx'
import { Badge } from '../../components/Badge.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import { Link } from 'react-router-dom'
import { useToast } from '../../contexts/ToastContext.jsx'

export default function StudentCourses() {
  const { user } = useAuth()
  const { courses, enrollments, addEnrollment, addNotification, addActivity } = useLMS()
  const toast = useToast()

  const published = courses.filter((c) => c.status === 'published' && c.enabled)
  const myEnrollments = enrollments.filter((e) => e.userId === user?.id)
  const myCourseIds = myEnrollments.map((e) => e.courseId)
  const enrolled = published.filter((c) => myCourseIds.includes(c.id))
  const available = published.filter((c) => !myCourseIds.includes(c.id))

  const handleEnroll = (courseId) => {
    const course = courses.find((c) => c.id === courseId)
    addEnrollment({ courseId, userId: user?.id })
    addNotification({ userId: user?.id, title: 'Enrolled', message: `You enrolled in a new course.` })
    addActivity('STUDENT_ENROLLED', `Enrolled in ${course?.title || 'course'}`, {
      userId: user?.id,
      role: user?.role,
      courseId,
    })
    toast.toast('Successfully enrolled in course', 'success')
  }

  if (published.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">My Courses</h2>
          <p className="text-xs text-slate-500">Browse and enroll in published courses</p>
        </div>
        <EmptyState
          title="No courses available"
          description="There are no published courses yet. Check back later."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">My Courses</h2>
        <p className="text-xs text-slate-500">Browse and enroll in published courses</p>
      </div>

      {enrolled.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-slate-700">Enrolled</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrolled.map((c) => (
              <Link
                key={c.id}
                to={`/student/courses/${c.id}`}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-slate-900">{c.title}</h4>
                  <Badge variant="published">Published</Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-slate-500">{c.description}</p>
                <span className="mt-3 inline-block text-xs font-medium text-indigo-600">View course →</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {available.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-slate-700">Available to enroll</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {available.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-slate-900">{c.title}</h4>
                  <Badge variant="published">Published</Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-slate-500">{c.description}</p>
                <button
                  type="button"
                  onClick={() => handleEnroll(c.id)}
                  className="mt-3 rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-600"
                >
                  Enroll
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {enrolled.length === 0 && available.length === 0 && (
        <EmptyState
          title="No courses"
          description="You have not enrolled in any courses yet."
        />
      )}
    </div>
  )
}
