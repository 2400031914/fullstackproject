import { useAuth } from '../../contexts/AuthContext.jsx'
import { useLMS } from '../../contexts/LMSContext.jsx'
import { StatsCard } from '../../components/StatsCard.jsx'
import { Badge } from '../../components/Badge.jsx'
import { Link } from 'react-router-dom'

export default function StudentDashboard() {
  const { user } = useAuth()
  const { courses, enrollments, assignments, submissions } = useLMS()

  const myEnrollments = enrollments.filter((e) => e.userId === user?.id)
  const myCourseIds = myEnrollments.map((e) => e.courseId)
  const myCourses = courses.filter((c) => c.status === 'published' && c.enabled && myCourseIds.includes(c.id))

  const myAssignments = assignments.filter((a) => myCourseIds.includes(a.courseId))
  const dueThisWeek = myAssignments.filter((a) => {
    const due = new Date(a.dueDate).getTime()
    const now = Date.now()
    const week = 7 * 24 * 60 * 60 * 1000
    return due >= now && due <= now + week
  })

  const mySubmissions = submissions.filter((s) => s.userId === user?.id)
  const gradedCount = mySubmissions.filter((s) => s.status === 'graded').length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Dashboard</h2>
        <p className="text-xs text-slate-500">Overview of your courses and activity</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard label="Enrolled courses" value={myCourses.length} />
        <StatsCard label="Assignments due this week" value={dueThisWeek.length} />
        <StatsCard label="Graded submissions" value={gradedCount} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">My courses</h3>
            <Link to="/student/courses" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
              View all
            </Link>
          </div>
          {myCourses.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
              No courses yet. <Link to="/student/courses" className="font-medium text-indigo-600">Browse courses</Link> to enroll.
            </div>
          ) : (
            <div className="space-y-2">
              {myCourses.slice(0, 5).map((c) => (
                <Link
                  key={c.id}
                  to={`/student/courses/${c.id}`}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 hover:bg-slate-100"
                >
                  <span className="text-sm font-medium text-slate-900">{c.title}</span>
                  <Badge variant="published">Published</Badge>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Upcoming deadlines</h3>
          {dueThisWeek.length === 0 ? (
            <p className="text-xs text-slate-500">No assignments due this week</p>
          ) : (
            <div className="space-y-2">
              {dueThisWeek.slice(0, 4).map((a) => {
                const course = courses.find((c) => c.id === a.courseId)
                return (
                  <div key={a.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs">
                    <div className="font-medium text-slate-900">{a.title}</div>
                    <div className="text-slate-500">{course?.title} · Due {new Date(a.dueDate).toLocaleDateString()}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
