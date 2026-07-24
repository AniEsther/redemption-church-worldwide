import { useEffect, useState } from 'react'

function getTimeLeft(target) {
  const diff = target ? target - new Date() : 0
  const clamped = Math.max(diff, 0)
  return {
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / (1000 * 60)) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
  }
}

export default function Countdown({ target }) {
  const [time, setTime] = useState(() => getTimeLeft(target))

  useEffect(() => {
    setTime(getTimeLeft(target))
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ]

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5">
      {units.map((u) => (
        <div
          key={u.label}
          className="w-16 rounded-xl border border-orange-400/30 bg-white/5 py-3 text-center backdrop-blur-sm sm:w-20"
        >
          <div className="font-display text-2xl font-bold text-orange-300 sm:text-3xl">
            {String(u.value).padStart(2, '0')}
          </div>
          <div className="eyebrow mt-1 text-[10px] text-cream/70">{u.label}</div>
        </div>
      ))}
    </div>
  )
}
