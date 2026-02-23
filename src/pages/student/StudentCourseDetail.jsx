import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useLMS } from '../../contexts/LMSContext.jsx'
import { Modal } from '../../components/Modal.jsx'
import { Badge } from '../../components/Badge.jsx'
import { SAMPLE_QUIZ_BY_COURSE } from '../../utils/sampleQuiz.js'

export default function StudentCourseDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { courses, materials, enrollments, addQuizResult, addActivity } = useLMS()
  const [pdfModal, setPdfModal] = useState(null)
  const [quizOpen, setQuizOpen] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState(null)

  const course = courses.find((c) => c.id === id)
  const isEnrolled = enrollments.some((e) => e.courseId === id && e.userId === user?.id)
  const courseMaterials = materials.filter((m) => m.courseId === id).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const quizQuestions = SAMPLE_QUIZ_BY_COURSE[id] || []

  if (!course) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-500">Course not found.</p>
        <Link to="/student/courses" className="mt-2 inline-block text-sm font-medium text-indigo-600">Back to courses</Link>
      </div>
    )
  }

  if (!isEnrolled) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-500">You must enroll in this course to view its content.</p>
        <Link to="/student/courses" className="mt-2 inline-block text-sm font-medium text-indigo-600">Back to courses</Link>
      </div>
    )
  }

  const handleQuizSubmit = () => {
    if (!quizQuestions.length) return
    let correct = 0
    quizQuestions.forEach((q) => {
      if (Number(quizAnswers[q.id]) === q.correct) correct++
    })
    const maxScore = quizQuestions.length
    const percentage = maxScore ? Math.round((correct / maxScore) * 100) : 0
    setQuizScore(percentage)
    setQuizSubmitted(true)
    addQuizResult({
      userId: user?.id,
      courseId: id,
      score: correct,
      maxScore,
      percentage,
    })
    addActivity('QUIZ_SUBMITTED', `Quiz submitted in ${course.title}`, {
      userId: user?.id,
      role: user?.role,
      courseId: id,
    })
  }

  const typeLabels = { pdf: 'PDF', video: 'Video', quiz: 'Quiz' }
  const typeIcons = {
    pdf: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    video: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    quiz: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link to="/student/courses" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">← Back to courses</Link>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">{course.title}</h2>
          <p className="text-xs text-slate-500">{course.description}</p>
        </div>
        <Badge variant={course.status === 'published' ? 'published' : 'draft'}>{course.status}</Badge>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900">Modules</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {courseMaterials.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">No materials yet</div>
          ) : (
            courseMaterials.map((m, idx) => (
              <div key={m.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{idx + 1}.</span>
                  <span className="text-slate-400">{typeIcons[m.type] || typeIcons.pdf}</span>
                  <span className="text-sm font-medium text-slate-900">{m.title}</span>
                  <Badge variant="default">{typeLabels[m.type] || 'PDF'}</Badge>
                </div>
                <div className="flex gap-2">
                  {m.type === 'pdf' && (
                    <button
                      type="button"
                      onClick={() => setPdfModal(m)}
                      className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Preview
                    </button>
                  )}
                  {m.type === 'video' && (
                    <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs text-slate-500">Video placeholder</span>
                  )}
                  {m.type === 'quiz' && (
                    <button
                      type="button"
                      onClick={() => setQuizOpen(true)}
                      className="rounded-lg bg-indigo-500 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-600"
                    >
                      Take quiz
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal open={!!pdfModal} onClose={() => setPdfModal(null)} title={pdfModal?.title}>
        <div className="space-y-4">
          <div className="flex aspect-video items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
            <div className="text-center text-slate-500">
              <svg className="mx-auto h-16 w-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm">PDF preview placeholder</p>
              <p className="text-xs">In production, this would display the actual PDF</p>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={quizOpen} onClose={() => setQuizOpen(false)} title="Module Quiz">
        <div className="space-y-4">
          {!quizSubmitted ? (
            <>
              {quizQuestions.map((q) => (
                <div key={q.id} className="rounded-lg border border-slate-200 p-3">
                  <p className="mb-2 text-sm font-medium text-slate-900">{q.question}</p>
                  <div className="space-y-1">
                    {q.options.map((opt, i) => (
                      <label key={i} className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name={q.id}
                          value={i}
                          checked={Number(quizAnswers[q.id]) === i}
                          onChange={(e) => setQuizAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-slate-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleQuizSubmit}
                disabled={quizQuestions.length === 0 || Object.keys(quizAnswers).length < quizQuestions.length}
                className="w-full rounded-lg bg-indigo-500 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-indigo-600 disabled:hover:bg-indigo-500"
              >
                Submit quiz
              </button>
            </>
          ) : (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center">
              <p className="text-lg font-semibold text-emerald-800">Score: {quizScore}%</p>
              <p className="mt-1 text-sm text-emerald-700">
                {quizScore >= 70 ? 'Well done!' : 'Keep practicing!'}
              </p>
              <button
                type="button"
                onClick={() => setQuizOpen(false)}
                className="mt-3 rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
