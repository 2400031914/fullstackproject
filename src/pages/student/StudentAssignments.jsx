import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useLMS } from '../../contexts/LMSContext.jsx'
import { Badge } from '../../components/Badge.jsx'
import { Modal } from '../../components/Modal.jsx'
import { FileUpload } from '../../components/FileUpload.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'

export default function StudentAssignments() {
  const { user } = useAuth()
  const { courses, assignments, submissions, enrollments, addSubmission, addNotification } = useLMS()
  const toast = useToast()
  const [uploadModal, setUploadModal] = useState(null)
  const [file, setFile] = useState(null)
  const [uploadError, setUploadError] = useState('')

  const myEnrollments = enrollments.filter((e) => e.userId === user?.id)
  const myCourseIds = myEnrollments.map((e) => e.courseId)
  const myAssignments = assignments.filter((a) => myCourseIds.includes(a.courseId))

  const getSubmission = (assignmentId) => submissions.find((s) => s.assignmentId === assignmentId && s.userId === user?.id)
  const getStatus = (a) => {
    const sub = getSubmission(a.id)
    if (!sub) return a.dueDate < Date.now() ? 'overdue' : 'not_submitted'
    return sub.status || 'submitted'
  }
  const statusVariant = (status) => {
    if (status === 'graded') return 'graded'
    if (status === 'overdue') return 'overdue'
    if (status === 'submitted') return 'submitted'
    return 'draft'
  }
  const statusLabel = (status) => {
    if (status === 'graded') return 'Graded'
    if (status === 'overdue') return 'Overdue'
    if (status === 'submitted') return 'Submitted'
    return 'Not Submitted'
  }

  const handleSubmit = () => {
    if (!file || !uploadModal) return
    setUploadError('')
    const sub = getSubmission(uploadModal.id)
    if (sub) {
      toast.toast('Already submitted. Contact instructor for resubmission.', 'info')
      setUploadModal(null)
      setFile(null)
      return
    }
    addSubmission({
      assignmentId: uploadModal.id,
      userId: user?.id,
      fileName: file.name,
      submittedAt: Date.now(),
      status: 'submitted',
    })
    addNotification({ userId: user?.id, title: 'Assignment submitted', message: `You submitted ${file.name}` })
    toast.toast('Assignment submitted successfully', 'success')
    setUploadModal(null)
    setFile(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Assignments</h2>
        <p className="text-xs text-slate-500">View and submit your assignments</p>
      </div>

      {myAssignments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-500">
          No assignments yet
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Assignment</th>
                <th className="px-4 py-3 font-medium">Due date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Grade / Feedback</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myAssignments.map((a) => {
                const course = courses.find((c) => c.id === a.courseId)
                const sub = getSubmission(a.id)
                const status = getStatus(a)
                return (
                  <tr key={a.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-slate-700">{course?.title}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{a.title}</td>
                    <td className="px-4 py-3 text-slate-600">{new Date(a.dueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant(status)}>{statusLabel(status)}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {sub?.status === 'graded' ? (
                        <span>
                          {sub.marks}/{a.maxMarks} · {sub.feedback || '-'}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {status !== 'submitted' && status !== 'graded' && (
                        <button
                          type="button"
                          onClick={() => setUploadModal(a)}
                          className="rounded-lg bg-indigo-500 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-600"
                        >
                          Submit PDF
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!uploadModal}
        onClose={() => { setUploadModal(null); setFile(null); setUploadError(''); }}
        title={uploadModal ? `Submit: ${uploadModal.title}` : ''}
      >
        {uploadModal && (
          <div className="space-y-4">
            <FileUpload
              onFileSelect={(f) => { setFile(f); setUploadError(''); }}
              error={uploadError}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setUploadModal(null); setFile(null); }}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!file}
                className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50 hover:bg-indigo-600 disabled:hover:bg-indigo-500"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
