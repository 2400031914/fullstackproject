export function ProgressBar({ value, max = 100, showLabel = true }) {
  const pct = Math.min(100, Math.max(0, max ? (value / max) * 100 : 0))
  return (
    <div className="space-y-1">
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-500">
          <span>{Math.round(pct)}% complete</span>
        </div>
      )}
    </div>
  )
}
