export function AdminHeader({ title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-brown-700 dark:text-cream">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-brown-500 dark:text-cream/60">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-brown-100 bg-white p-6 dark:border-brown-700 dark:bg-brown-800 ${className}`}>
      {children}
    </div>
  )
}

export function EmptyState({ text }) {
  return <p className="py-10 text-center text-sm text-brown-400 dark:text-cream/40">{text}</p>
}

export function Loading() {
  return <p className="py-10 text-center text-sm text-brown-400 dark:text-cream/40">Loading…</p>
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-brown-600 dark:text-cream/70">{label}</span>
      {children}
    </label>
  )
}

export const inputClass =
  'w-full rounded-lg border border-brown-200 bg-cream px-3 py-2.5 text-sm focus:border-orange-400 dark:border-brown-600 dark:bg-brown-900 dark:text-cream'

export function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="rounded-full bg-orange-400 px-5 py-2.5 eyebrow text-[11px] text-white transition-transform hover:scale-105 disabled:opacity-60"
    >
      {children}
    </button>
  )
}

export function GhostButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="rounded-full border border-brown-200 px-4 py-2 text-xs text-brown-600 transition-colors hover:border-orange-400 hover:text-orange-500 dark:border-brown-600 dark:text-cream/70"
    >
      {children}
    </button>
  )
}

export function DangerButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="rounded-full border border-red-200 px-4 py-2 text-xs text-red-500 transition-colors hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
    >
      {children}
    </button>
  )
}
