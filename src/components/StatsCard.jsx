export function StatsCard({ label, value, trend, trendLabel }) {
  const positive = trend >= 0

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <div className="text-2xl font-semibold text-slate-900">{value}</div>
        {trend != null && (
          <div
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              positive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            <span>{positive ? '▲' : '▼'}</span>
            <span>{Math.abs(trend)}%</span>
            {trendLabel && (
              <span className="text-[10px] text-slate-500">{trendLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

