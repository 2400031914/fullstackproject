import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-400 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40">
              NL
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide text-slate-50">
                NovaLearn
              </span>
              <span className="text-[11px] text-slate-400">
                Learn without limits
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-200 hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/40 hover:brightness-110"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="border-b border-slate-900/60 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
          <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-16">
            <div className="max-w-3xl text-center">
              <p className="mb-3 inline-flex rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-[11px] font-medium text-slate-300">
                Trusted dashboards for students, instructors, and teams
              </p>
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
                Learn Without Limits with{' '}
                <span className="bg-gradient-to-tr from-indigo-400 via-violet-400 to-sky-300 bg-clip-text text-transparent">
                  NovaLearn
                </span>
              </h1>
              <p className="mt-4 text-sm text-slate-300 sm:text-base">
                A modern learning platform that connects students, instructors,
                admins, and creators in one unified experience. Track progress,
                manage courses, and accelerate outcomes in a beautiful SaaS
                interface.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/register"
                  className="rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 hover:brightness-110"
                >
                  Start Learning Today
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-200 hover:text-white"
                >
                  Already have an account?
                </Link>
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="mt-10 w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl shadow-slate-950/60">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Dashboard preview
                  </p>
                  <p className="text-sm font-semibold text-slate-100">
                    Student • Instructor • Admin • Creator
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
                  Live analytics
                </span>
              </div>
              <div className="grid gap-3 rounded-xl bg-slate-950/40 p-3 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-3">
                  <p className="text-[11px] font-medium text-slate-400">
                    Student
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-50">
                    My Progress
                  </p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-indigo-500 to-sky-400" />
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400">
                    12 courses • 4 in progress
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-3">
                  <p className="text-[11px] font-medium text-slate-400">
                    Instructor
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-50">
                    Grading queue
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-amber-300">
                    18
                    <span className="ml-1 text-xs text-slate-400">
                      submissions
                    </span>
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-3">
                  <p className="text-[11px] font-medium text-slate-400">
                    Admin
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-50">
                    Platform health
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-emerald-300">
                    99.98%
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    uptime this quarter
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-3">
                  <p className="text-[11px] font-medium text-slate-400">
                    Creator
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-50">
                    Draft pipeline
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-violet-300">
                    12
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    modules in review
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-b border-slate-900 bg-slate-950 py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-xl font-semibold text-slate-50 sm:text-2xl">
              Everything You Need to Excel
            </h2>
            <p className="mt-2 text-center text-sm text-slate-400">
              From content to analytics, NovaLearn gives every role what they
              need to do their best work.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {[
                {
                  title: 'Rich Course Content',
                  desc: 'Modular lessons, downloadable resources, and interactive quizzes built for deep understanding.',
                  color: 'from-indigo-500 to-sky-400',
                },
                {
                  title: 'Track Your Progress',
                  desc: 'Visual dashboards, completion tracking, and real-time feedback keep learners on course.',
                  color: 'from-emerald-500 to-lime-400',
                },
                {
                  title: 'Earn Certificates',
                  desc: 'Completion certificates and performance summaries ready to share with your organization.',
                  color: 'from-amber-500 to-rose-400',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/60"
                >
                  <div
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr ${card.color} text-sm font-semibold text-white`}
                  >
                    ●
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-50">
                    {card.title}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-slate-900 bg-slate-950 py-10">
          <div className="mx-auto max-w-5xl px-4">
            <div className="grid gap-6 text-center sm:grid-cols-4">
              {[
                ['10K+', 'Active Students'],
                ['500+', 'Expert Instructors'],
                ['1K+', 'Quality Courses'],
                ['95%', 'Success Rate'],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="text-2xl font-semibold text-slate-50">
                    {value}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application flow */}
        <section className="border-b border-slate-900 bg-slate-950 py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-xl font-semibold text-slate-50 sm:text-2xl">
              How NovaLearn Fits Your Flow
            </h2>
            <p className="mt-2 text-center text-sm text-slate-400">
              From first visit to personalized dashboards in three simple
              steps.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {[
                'Landing',
                'Login / Register',
                'Role Dashboard',
              ].map((step, idx) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="rounded-full border border-slate-700 bg-slate-900 px-4 py-1.5 text-xs font-medium text-slate-200">
                    {step}
                  </div>
                  {idx < 2 && (
                    <span className="hidden text-slate-500 sm:inline">→</span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              {[
                ['Student', 'Personalized learning journeys'],
                ['Instructor', 'Course & grading workspace'],
                ['Admin', 'Platform oversight & controls'],
                ['Creator', 'Content production pipeline'],
              ].map(([role, desc]) => (
                <div
                  key={role}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm shadow-lg shadow-slate-950/60"
                >
                  <p className="text-xs font-medium text-slate-400">Role</p>
                  <p className="mt-1 text-sm font-semibold text-slate-50">
                    {role}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-b border-slate-900 bg-slate-950 py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-xl font-semibold text-slate-50 sm:text-2xl">
              Teams Love Learning with NovaLearn
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {[
                ['AM', 'Ananya Mehta', 'Student', 'NovaLearn helped me keep every course, assignment, and quiz in one place. My grades and confidence both went up.'],
                ['JR', 'James Rivera', 'Instructor', 'Designing and grading courses is finally enjoyable. The dashboards surface exactly what I need each morning.'],
                ['LC', 'Lena Chen', 'Program Admin', 'We now have a clear picture of engagement and outcomes across cohorts. It feels like running a modern product, not a paper system.'],
              ].map(([initials, name, role, quote]) => (
                <div
                  key={name}
                  className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/60"
                >
                  <div className="flex items-center gap-1 text-amber-300">
                    {'★★★★★'}
                  </div>
                  <p className="mt-3 text-xs text-slate-300">{quote}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-100">
                      {initials}
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-slate-50">{name}</p>
                      <p className="text-slate-400">{role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-slate-950 py-14">
          <div className="mx-auto max-w-5xl px-4">
            <div className="rounded-3xl bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400 p-[1px] shadow-2xl shadow-indigo-500/40">
              <div className="rounded-3xl bg-slate-950 px-6 py-8 text-center sm:px-10 sm:py-10">
                <h2 className="text-lg font-semibold text-slate-50 sm:text-xl">
                  Ready to Start Your Learning Journey?
                </h2>
                <p className="mt-2 text-sm text-slate-200">
                  Create your free NovaLearn account and unlock personalized
                  dashboards for every role.
                </p>
                <div className="mt-5 flex justify-center">
                  <Link
                    to="/register"
                    className="rounded-full bg-white/10 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/60 backdrop-blur hover:bg-white/20"
                  >
                    Create Free Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} NovaLearn. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" className="hover:text-slate-200">
              About
            </button>
            <button type="button" className="hover:text-slate-200">
              Features
            </button>
            <button type="button" className="hover:text-slate-200">
              Contact
            </button>
            <button type="button" className="hover:text-slate-200">
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

