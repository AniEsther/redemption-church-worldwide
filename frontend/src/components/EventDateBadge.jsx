import { formatDay, formatMonth } from '../lib/useApiData'

// Renders a compact day/month badge for a single date, or a wider pill for
// a custom date range label (e.g. "Sept 14–20") so long text never
// overflows a fixed-size box.
export default function EventDateBadge({ date, dateLabel }) {
  if (dateLabel) {
    return (
      <div className="flex min-h-16 w-20 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-brown-700 px-2 py-2 text-center text-cream">
        <span className="font-display text-xs font-bold leading-tight text-orange-300 break-words">{dateLabel}</span>
      </div>
    )
  }

  return (
    <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-brown-700 text-cream">
      <span className="font-display text-lg font-bold text-orange-300">{formatDay(date)}</span>
      <span className="eyebrow text-[9px]">{formatMonth(date)}</span>
    </div>
  )
}
