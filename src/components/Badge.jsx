const variants = {
  draft: 'bg-slate-100 text-slate-700',
  published: 'bg-emerald-100 text-emerald-800',
  submitted: 'bg-amber-100 text-amber-800',
  graded: 'bg-indigo-100 text-indigo-800',
  overdue: 'bg-rose-100 text-rose-800',
  default: 'bg-slate-100 text-slate-700',
}

export function Badge({ children, variant = 'default' }) {
  const cls = variants[variant] ?? variants.default
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {children}
    </span>
  )
}
