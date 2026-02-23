import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useLMS } from '../../contexts/LMSContext.jsx'
import { StatsCard } from '../../components/StatsCard.jsx'
import { Badge } from '../../components/Badge.jsx'
import { Modal } from '../../components/Modal.jsx'
import { FileUpload } from '../../components/FileUpload.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'

export default function InstructorDashboard() {
  const { user } = useAuth()
  const {
    courses,
    materials,
    assignments,
    enrollments,
    submissions,
    users,
    addCourse,
    updateCourse,
    deleteCourse,
    addMaterial,
    addAssignment,
    updateSubmission,
    addNotification,
  } = useLMS()
  const toast = useToast()

  const [createModal, setCreateModal] = useState(false)
  const [editModal, setEditModal] = useState(null)
  const [materialModal, setMaterialModal] = useState(null)
  const [assignModal, setAssignModal] = useState(false)
  const [gradeModal, setGradeModal] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const [formTitle, setFormTitle] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formStatus, setFormStatus] = useState('draft')
  const [materialFile, setMaterialFile] = useState(null)
  const [assignTitle, setAssignTitle] = useState('')
  const [assignDue, setAssignDue] = useState('')
  const [assignMarks, setAssignMarks] = useState(100)
  const [assignCourseId, setAssignCourseId] = useState('')
  const [gradeMarks, setGradeMarks] = useState('')
  const [gradeFeedback, setGradeFeedback] = useState('')
  const [formErrors, setFormErrors] = useState({})

  const myCourses = courses.filter((c) => c.instructorId === user?.id)

  const validateCourse = () => {
    const e = {}
    if (!formTitle?.trim()) e.title = 'Title is required'
    setFormErrors(e)
    return Object.keys(e).length === 0
  }

  const handleCreateCourse = () => {
    if (!validateCourse()) return
    addCourse({ title: formTitle.trim(), description: formDesc.trim(), status: formStatus, instructorId: user?.id })
    toast.toast('Course created', 'success')
    setCreateModal(false)
    setFormTitle('')
    setFormDesc('')
    setFormStatus('draft')
    setFormErrors({})
  }

  const handleEditCourse = () => {
    if (!editModal || !validateCourse()) return
    updateCourse(editModal.id, { title: formTitle.trim(), description: formDesc.trim(), status: formStatus })
    toast.toast('Course updated', 'success')
    setEditModal(null)
    setFormTitle('')
    setFormDesc('')
    setFormErrors({})
  }

  const handleDeleteCourse = () => {
    if (!deleteConfirm) return
    deleteCourse(deleteConfirm.id)
    toast.toast('Course deleted', 'success')
    setDeleteConfirm(null)
  }

  const handleAddMaterial = () => {
    if (!materialModal || !materialFile) {
      toast.toast('Please select a PDF file', 'error')
      return
    }
    addMaterial({ courseId: materialModal.id, title: materialFile.name.replace(/\.pdf$/i, ''), type: 'pdf', url: '#', order: materialModal.materialsCount ?? 0 })
    toast.toast('Material added', 'success')
    setMaterialModal(null)
    setMaterialFile(null)
  }

  const handleAddAssignment = () => {
    if (!assignTitle?.trim() || !assignDue || !assignCourseId) {
      toast.toast('Fill all required fields', 'error')
      return
    }
    addAssignment({ courseId: assignCourseId, title: assignTitle.trim(), dueDate: new Date(assignDue).getTime(), maxMarks: Number(assignMarks) || 100 })
    toast.toast('Assignment created', 'success')
    setAssignModal(false)
    setAssignTitle('')
    setAssignDue('')
    setAssignMarks(100)
    setAssignCourseId('')
  }

  const handleGrade = () => {
    if (!gradeModal) return
    const marks = Number(gradeMarks)
    if (isNaN(marks) || marks < 0) {
      toast.toast('Enter valid marks', 'error')
      return
    }
    const sub = gradeModal
    updateSubmission(sub.id, { marks, feedback: gradeFeedback.trim(), status: 'graded' })
    addNotification({ userId: sub.userId, title: 'Assignment graded', message: `Your submission received ${marks} marks.` })
    toast.toast('Submission graded', 'success')
    setGradeModal(null)
    setGradeMarks('')
    setGradeFeedback('')
  }

  const pendingSubmissions = submissions.filter((s) => s.status === 'submitted')
  const totalSubs = submissions.length
  const gradedSubs = submissions.filter((s) => s.status === 'graded').length
  const avgMarks = gradedSubs > 0
    ? Math.round(submissions.filter((s) => s.status === 'graded').reduce((a, s) => a + (s.marks ?? 0), 0) / gradedSubs)
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Instructor dashboard</h2>
          <p className="text-xs text-slate-500">Manage courses, materials, and submissions</p>
        </div>
        <button
          type="button"
          onClick={() => { setCreateModal(true); setFormTitle(''); setFormDesc(''); setFormStatus('draft'); }}
          className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-600"
        >
          Create course
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard label="My courses" value={myCourses.length} />
        <StatsCard label="Submissions awaiting review" value={pendingSubmissions.length} />
        <StatsCard label="Avg marks (graded)" value={avgMarks} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">My courses</h3>
            <button
              type="button"
              onClick={() => setAssignModal(true)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              + Add assignment
            </button>
          </div>
          {myCourses.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-500">No courses yet. Create one above.</p>
          ) : (
            <div className="space-y-2">
              {myCourses.map((c) => {
                const matCount = materials.filter((m) => m.courseId === c.id).length
                const enrollCount = enrollments.filter((e) => e.courseId === c.id).length
                const assignCount = assignments.filter((a) => a.courseId === c.id).length
                return (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                    <div>
                      <div className="font-medium text-slate-900">{c.title}</div>
                      <div className="text-xs text-slate-500">{enrollCount} enrolled · {assignCount} assignments · {matCount} materials</div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={c.status === 'published' ? 'published' : 'draft'}>{c.status}</Badge>
                      <button
                        type="button"
                        onClick={() => { setMaterialModal({ ...c, materialsCount: matCount }); setMaterialFile(null); }}
                        className="text-xs font-medium text-indigo-600"
                      >
                        + Material
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditModal(c); setFormTitle(c.title); setFormDesc(c.description || ''); setFormStatus(c.status); }}
                        className="text-xs font-medium text-slate-600"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(c)}
                        className="text-xs font-medium text-rose-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Submissions to grade</h3>
          {pendingSubmissions.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-500">No pending submissions</p>
          ) : (
            <div className="space-y-2">
              {pendingSubmissions.slice(0, 8).map((s) => {
                const a = assignments.find((x) => x.id === s.assignmentId)
                const course = courses.find((x) => x.id === a?.courseId)
                const u = users.find((x) => x.id === s.userId)
                return (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{a?.title}</div>
                      <div className="text-xs text-slate-500">{u?.email} · {s.fileName}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setGradeModal(s); setGradeMarks(a?.maxMarks ?? ''); setGradeFeedback(''); }}
                      className="rounded-lg bg-indigo-500 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-600"
                    >
                      Grade
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Assignment analytics</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="text-xs text-slate-500">Total submissions</div>
            <div className="text-xl font-semibold text-slate-900">{totalSubs}</div>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="text-xs text-slate-500">Average marks</div>
            <div className="text-xl font-semibold text-slate-900">{avgMarks}</div>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="text-xs text-slate-500">Submission rate</div>
            <div className="text-xl font-semibold text-slate-900">
              {assignments.length > 0 ? Math.round((totalSubs / (assignments.length * Math.max(1, enrollments.length))) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>

      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Create course">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Title *</label>
            <input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="Course title"
            />
            {formErrors.title && <p className="mt-1 text-xs text-rose-600">{formErrors.title}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Description</label>
            <textarea
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              rows={3}
              placeholder="Brief description"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Status</label>
            <select
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setCreateModal(false)} className="rounded-lg border px-3 py-1.5 text-sm">Cancel</button>
            <button type="button" onClick={handleCreateCourse} className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm text-white hover:bg-indigo-600">Create</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Edit course">
        {editModal && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Title *</label>
              <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              {formErrors.title && <p className="mt-1 text-xs text-rose-600">{formErrors.title}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Description</label>
              <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" rows={3} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Status</label>
              <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditModal(null)} className="rounded-lg border px-3 py-1.5 text-sm">Cancel</button>
              <button type="button" onClick={handleEditCourse} className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm text-white hover:bg-indigo-600">Save</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!materialModal} onClose={() => { setMaterialModal(null); setMaterialFile(null); }} title="Upload material (PDF)">
        {materialModal && (
          <div className="space-y-4">
            <FileUpload onFileSelect={setMaterialFile} />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setMaterialModal(null); setMaterialFile(null); }} className="rounded-lg border px-3 py-1.5 text-sm">Cancel</button>
              <button type="button" onClick={handleAddMaterial} disabled={!materialFile} className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm text-white disabled:opacity-50 hover:bg-indigo-600">Add</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={assignModal} onClose={() => setAssignModal(false)} title="Create assignment">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Course *</label>
            <select value={assignCourseId} onChange={(e) => setAssignCourseId(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option value="">Select course</option>
              {myCourses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Title *</label>
            <input value={assignTitle} onChange={(e) => setAssignTitle(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Assignment title" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Due date *</label>
            <input type="date" value={assignDue} onChange={(e) => setAssignDue(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Max marks</label>
            <input type="number" value={assignMarks} onChange={(e) => setAssignMarks(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" min={1} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setAssignModal(false)} className="rounded-lg border px-3 py-1.5 text-sm">Cancel</button>
            <button type="button" onClick={handleAddAssignment} disabled={!assignTitle?.trim() || !assignDue || !assignCourseId} className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm text-white disabled:opacity-50 hover:bg-indigo-600">Create</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!gradeModal} onClose={() => setGradeModal(null)} title="Grade submission">
        {gradeModal && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">File: {gradeModal.fileName}</p>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Marks *</label>
              <input type="number" value={gradeMarks} onChange={(e) => setGradeMarks(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" min={0} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Feedback</label>
              <textarea value={gradeFeedback} onChange={(e) => setGradeFeedback(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" rows={3} placeholder="Instructor feedback" />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setGradeModal(null)} className="rounded-lg border px-3 py-1.5 text-sm">Cancel</button>
              <button type="button" onClick={handleGrade} className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm text-white hover:bg-indigo-600">Submit grade</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete course?">
        {deleteConfirm && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Are you sure you want to delete &quot;{deleteConfirm.title}&quot;? This cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setDeleteConfirm(null)} className="rounded-lg border px-3 py-1.5 text-sm">Cancel</button>
              <button type="button" onClick={handleDeleteCourse} className="rounded-lg bg-rose-500 px-3 py-1.5 text-sm text-white hover:bg-rose-600">Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
