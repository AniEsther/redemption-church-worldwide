const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// "9:00 PM" / "6:30 AM" -> { hours, minutes } in 24h time. Defaults to midnight if unparseable.
function parseTime(timeStr) {
  const m = (timeStr || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
  if (!m) return { hours: 0, minutes: 0 }
  let hours = parseInt(m[1], 10)
  const minutes = parseInt(m[2], 10)
  const ampm = m[3] ? m[3].toUpperCase() : null
  if (ampm === 'PM' && hours !== 12) hours += 12
  if (ampm === 'AM' && hours === 12) hours = 0
  return { hours, minutes }
}

// Guess a weekday index (0-6) from a free-text day label like "Sundays" or "Wednesday Midweek".
function guessWeekday(label) {
  const lower = (label || '').toLowerCase()
  const idx = WEEKDAYS.findIndex((w) => lower.includes(w.toLowerCase().slice(0, 3)))
  return idx
}

// The Nth (1-4) or Last (-1) occurrence of `weekday` in the given month.
function nthWeekdayOfMonth(year, month, weekday, n) {
  if (n === -1) {
    const last = new Date(year, month + 1, 0)
    const diff = (last.getDay() - weekday + 7) % 7
    last.setDate(last.getDate() - diff)
    return last
  }
  const first = new Date(year, month, 1)
  const diff = (weekday - first.getDay() + 7) % 7
  const day = 1 + diff + (n - 1) * 7
  return new Date(year, month, day)
}

const WEEK_NUMBER = { First: 1, Second: 2, Third: 3, Fourth: 4, Last: -1 }

// Computes the next upcoming Date for a single special programme (used both
// for the homepage countdown and for sorting the Events page programme list).
export function getNextProgrammeDate(programme, now = new Date()) {
  if (!programme.dayOfWeek || !programme.weekOfMonth) return null
  const weekday = WEEKDAYS.indexOf(programme.dayOfWeek)
  const n = WEEK_NUMBER[programme.weekOfMonth]
  if (weekday === -1 || !n) return null
  const { hours, minutes } = parseTime(programme.time)

  let candidate = nthWeekdayOfMonth(now.getFullYear(), now.getMonth(), weekday, n)
  candidate.setHours(hours, minutes, 0, 0)
  if (candidate < now) {
    candidate = nthWeekdayOfMonth(now.getFullYear(), now.getMonth() + 1, weekday, n)
    candidate.setHours(hours, minutes, 0, 0)
  }
  return candidate
}

/**
 * Given serviceTimes, specialProgrammes, and upcoming events (all as loaded
 * from the API/settings), returns the single soonest upcoming occurrence as
 * { date: Date, label: string }, or null if nothing is scheduled.
 */
export function getNextOccurrence({ serviceTimes = [], specialProgrammes = [], events = [] }, now = new Date()) {
  const candidates = []

  // Weekly recurring services
  for (const block of serviceTimes) {
    const weekday = guessWeekday(block.day)
    if (weekday === -1) continue
    const dayName = WEEKDAYS[weekday]
    for (const item of block.items || []) {
      const { hours, minutes } = parseTime(item.time)
      const candidate = new Date(now)
      candidate.setHours(hours, minutes, 0, 0)
      let diff = (weekday - now.getDay() + 7) % 7
      candidate.setDate(now.getDate() + diff)
      if (candidate < now) candidate.setDate(candidate.getDate() + 7)
      candidates.push({ date: candidate, label: `${dayName} ${item.name}` })
    }
  }

  // Monthly special programmes (e.g. "Last Friday of every month")
  for (const programme of specialProgrammes) {
    if (!programme.name) continue
    const date = getNextProgrammeDate(programme, now)
    if (date) candidates.push({ date, label: programme.name })
  }

  // One-off dated events
  for (const event of events) {
    if (!event.date) continue
    const base = new Date(event.date)
    const { hours, minutes } = parseTime(event.time)
    const candidate = new Date(base.getFullYear(), base.getMonth(), base.getDate(), hours, minutes, 0, 0)
    if (candidate >= now) candidates.push({ date: candidate, label: event.title })
  }

  if (candidates.length === 0) return null
  candidates.sort((a, b) => a.date - b.date)
  return candidates[0]
}

// For displaying a schedule sentence from structured special-programme fields.
export function formatProgrammeSchedule(programme) {
  if (!programme.dayOfWeek || !programme.weekOfMonth) return ''
  const time = programme.time ? `, ${programme.time}` : ''
  return `${programme.weekOfMonth} ${programme.dayOfWeek} of every month${time}`
}
