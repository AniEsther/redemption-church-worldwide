import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function BankAccountCard({ account }) {
  const [copied, setCopied] = useState(false)

  const copyAccount = () => {
    navigator.clipboard?.writeText(account.accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="block h-full w-full overflow-hidden rounded-2xl border border-orange-400/30 bg-brown-700 text-cream">
      {account.label && (
        <div className="border-b border-cream/10 px-6 py-3">
          <p className="eyebrow text-xs text-orange-300">{account.label}</p>
        </div>
      )}
      <div className="divide-y divide-cream/10">
        <div className="px-6 py-4">
          <p className="eyebrow text-[10px] text-cream/50">Bank Name</p>
          <p className="mt-1 font-display text-sm font-semibold break-words">{account.bankName}</p>
        </div>
        <div className="px-6 py-4">
          <p className="eyebrow text-[10px] text-cream/50">Account Name</p>
          <p className="mt-1 font-display text-sm font-semibold break-words">{account.accountName}</p>
        </div>
        <div className="px-6 py-4">
          <p className="eyebrow text-[10px] text-cream/50">Account Number</p>
          <button onClick={copyAccount} className="mt-1 flex items-center gap-2 font-display text-sm font-semibold text-orange-300 hover:text-orange-200">
            {account.accountNumber}
            {copied ? <Check className="h-4 w-4 flex-shrink-0" /> : <Copy className="h-4 w-4 flex-shrink-0" />}
          </button>
        </div>
      </div>
    </div>
  )
}
