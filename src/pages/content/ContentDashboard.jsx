import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useLMS } from '../../contexts/LMSContext.jsx'
import { Badge } from '../../components/Badge.jsx'
import { Modal } from '../../components/Modal.jsx'
import { FileUpload } from '../../components/FileUpload.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'

export default function ContentDashboard() {
  const { user } = useAuth()
  const { courses, materials, addMaterial, updateMaterial, deleteMaterial } = useLMS()
  const toast = useToast()

  const [uploadModal, setUploadModal] = useState(false)
  const [editModal, setEditModal] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [attachCourseId, setAttachCourseId] = useState('')
  const [materialFile, setMaterialFile] = useState(null)
  const [materialTitle, setMaterialTitle] = useState('')
  const [editTitle, setEditTitle] = useState('')

  const publishedCourses = courses.filter((c) => c.status === 'published' || c.status === 'draft')

  const handleUpload = () => {
    if (!materialFile || !attachCourseId) {
      toast.toast('Select a PDF and course', 'error')
      return
    }
    addMaterial({
      courseId: attachCourseId,
      title: materialTitle.trim() || materialFile.name.replace(/\.pdf$/i, ''),
      type: 'pdf',
      url: '#',
      order: materials.filter((m) => m.courseId === attachCourseId).length,
    })
    toast.toast('Material uploaded', 'success')
    setUploadModal(false)
    setMaterialFile(null)
    setMaterialTitle('')
    setAttachCourseId('')
  }

  const handleEdit = () => {
    if (!editModal) return
    updateMaterial(editModal.id, { title: editTitle.trim() })
    toast.toast('Material updated', 'success')
    setEditModal(null)
    setEditTitle('')
  }

  const handleDelete = () => {
    if (!deleteConfirm) return
    deleteMaterial(deleteConfirm.id)
    toast.toast('Material deleted', 'success')
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Content workspace</h2>
          <p className="text-xs text-slate-500">Upload, attach, and manage course materials</p>
        </div>
        <button
          type="button"
          onClick={() => { setUploadModal(true); setMaterialFile(null); setMaterialTitle(''); setAttachCourseId(''); }}
          className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-600"
        >
          Upload material
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900">All materials</h3>
        </div>
        {materials.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-slate-500">No materials yet. Upload a PDF to get started.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {materials.map((m) => {
              const course = courses.find((c) => c.id === m.courseId)
              return (
                <div key={m.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{m.title}</div>
                      <div className="text-xs text-slate-500">{course?.title}</div>
                    </div>
                    <Badge variant="default">PDF</Badge>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setEditModal(m); setEditTitle(m.title); }}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(m)}
                      className="text-xs font-medium text-rose-600 hover:text-rose-700"
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

      <Modal open={uploadModal} onClose={() => { setUploadModal(false); setMaterialFile(null); }} title="Upload material (PDF only)">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Attach to course *</label>
            <select value={attachCourseId} onChange={(e) => setAttachCourseId(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option value="">Select course</option>
              {publishedCourses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Title (optional)</label>
            <input value={materialTitle} onChange={(e) => setMaterialTitle(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Material title" />
          </div>
          <FileUpload onFileSelect={setMaterialFile} />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setUploadModal(false)} className="rounded-lg border px-3 py-1.5 text-sm">Cancel</button>
            <button type="button" onClick={handleUpload} disabled={!materialFile || !attachCourseId} className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm text-white disabled:opacity-50 hover:bg-indigo-600">Upload</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Edit material">
        {editModal && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Title</label>
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditModal(null)} className="rounded-lg border px-3 py-1.5 text-sm">Cancel</button>
              <button type="button" onClick={handleEdit} disabled={!editTitle?.trim()} className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm text-white disabled:opacity-50 hover:bg-indigo-600">Save</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete material?">
        {deleteConfirm && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Are you sure you want to delete &quot;{deleteConfirm.title}&quot;?</p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setDeleteConfirm(null)} className="rounded-lg border px-3 py-1.5 text-sm">Cancel</button>
              <button type="button" onClick={handleDelete} className="rounded-lg bg-rose-500 px-3 py-1.5 text-sm text-white hover:bg-rose-600">Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
