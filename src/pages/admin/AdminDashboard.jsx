import { useState } from 'react'
import { useLMS } from '../../contexts/LMSContext.jsx'
import { StatsCard } from '../../components/StatsCard.jsx'
import { Badge } from '../../components/Badge.jsx'
import { Modal } from '../../components/Modal.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'

const ROLES_LIST = ['student', 'instructor', 'admin', 'content']

export default function AdminDashboard() {
  const { users, courses, enrollments, submissions, updateUser, updateCourse } = useLMS()
  const toast = useToast()
  const [roleModal, setRoleModal] = useState(null)
  const [selectedRole, setSelectedRole] = useState('')

  const handleRoleChange = () => {
    if (!roleModal || !selectedRole) return
    updateUser(roleModal.id, { role: selectedRole })
    toast.toast('Role updated', 'success')
    setRoleModal(null)
    setSelectedRole('')
  }

  const handleToggleCourse = (course) => {
    updateCourse(course.id, { enabled: !course.enabled })
    toast.toast(course.enabled ? 'Course disabled' : 'Course enabled', 'success')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Admin dashboard</h2>
        <p className="text-xs text-slate-500">Manage users, roles, and platform settings</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total users" value={users.length} />
        <StatsCard label="Total courses" value={courses.length} />
        <StatsCard label="Total enrollments" value={enrollments.length} />
        <StatsCard label="Total submissions" value={submissions.length} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Users</h3>
          {users.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-500">No users</p>
          ) : (
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{u.email || u.name || u.id}</div>
                    <div className="text-xs text-slate-500">{u.role} {u.disabled && '(disabled)'}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setRoleModal(u); setSelectedRole(u.role); }}
                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Change role
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Courses (enable/disable)</h3>
          {courses.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-500">No courses</p>
          ) : (
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {courses.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{c.title}</div>
                    <div className="flex gap-2">
                      <Badge variant={c.status === 'published' ? 'published' : 'draft'}>{c.status}</Badge>
                      <Badge variant={c.enabled ? 'published' : 'draft'}>{c.enabled ? 'Enabled' : 'Disabled'}</Badge>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleCourse(c)}
                    className={`rounded-lg px-2 py-1 text-xs font-medium ${c.enabled ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'}`}
                  >
                    {c.enabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal open={!!roleModal} onClose={() => { setRoleModal(null); setSelectedRole(''); }} title="Change user role">
        {roleModal && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">User: {roleModal.email || roleModal.name}</p>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">New role</label>
              <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                {ROLES_LIST.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setRoleModal(null)} className="rounded-lg border px-3 py-1.5 text-sm">Cancel</button>
              <button type="button" onClick={handleRoleChange} disabled={selectedRole === roleModal.role} className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm text-white disabled:opacity-50 hover:bg-indigo-600">Save</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
